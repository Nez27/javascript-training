import Controller from './controllers/controller';
import Service from './services/service';
import View from './views/view';
import 'regenerator-runtime/runtime';
import 'core-js/stable';

export default class App {
  constructor() {
    this.controller = new Controller(new Service(), new View());
  }

  start() {
    this.controller.registerController.init();
    this.controller.loginController.init();
    this.controller.homeController.init();
  }
}
