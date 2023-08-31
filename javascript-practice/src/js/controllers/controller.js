import RegisterController from './registerController';

export default class Controller {
  constructor(service, view) {
    this.registerController = new RegisterController(service, view);
  }
}
