import LoginController from './loginController';
import RegisterController from './registerController';

export default class Controller {
  constructor(service, view) {
    this.registerController = new RegisterController(service, view);
    this.loginController = new LoginController(service, view);
  }
}
