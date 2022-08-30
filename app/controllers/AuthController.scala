package controllers

import play.api.libs.json._
import play.api.mvc._

import javax.inject._

import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.client.googleapis.auth.oauth2._
@Singleton
class AuthController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
    .setAudience(java.util.Collections.singletonList("53370007102-gasokudqj0tb0s3kup5l7ak0uroehrl8.apps.googleusercontent.com"))
    .build

  def login(): Action[AnyContent] = Action { request =>
    val body = request.body.asFormUrlEncoded
    val csrf = (request.cookies.get("g_csrf_token"), body.get("g_csrf_token").headOption) match {
      case (Some(header), Some(fromBody)) =>
        println(header)
        if (header.value == fromBody) None else Option(BadRequest("Failed to verify double submit cookie"))
      case (None, _) =>
        Option(BadRequest("No CSRF token in Cookie"))
      case (_, None) =>
        Option(BadRequest("No CSRF token in post body"))
    }
    if (csrf.isEmpty) {
      // ok to handle
      val idToken = Option(verifier.verify(body.get("credential").head))
      if (idToken.isEmpty) {
        BadRequest("Invalid token")
      } else {
        Redirect("/").withSession(request.session + ("name" -> idToken.get.getPayload.get("name").toString))
      }
    } else {
      csrf.get
    }
  }

  def logout(): Action[AnyContent] = Action {
    Redirect("/").withNewSession
  }

}
