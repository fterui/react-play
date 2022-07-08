package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  def hello(): Action[AnyContent] = Action {
    val json: JsValue = Json.obj("text" -> "Hello World!")
    Ok(json)
  }

}
