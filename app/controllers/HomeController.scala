package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  def hello(): Action[AnyContent] = Action { request =>
    val name = request.session.get("name").getOrElse(null)
    val json: JsValue = Json.obj("name" -> name)
    Ok(json)
  }
}
