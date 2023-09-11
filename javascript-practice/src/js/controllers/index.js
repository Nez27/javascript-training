import HomeController from './homeController';
import LoginController from './loginController';
import RegisterController from './registerController';

export default class Controller {
  constructor(service, view) {
    this.registerController = new RegisterController(service, view);
    this.loginController = new LoginController(service, view);
    this.homeController = new HomeController(service, view);
  }
}
