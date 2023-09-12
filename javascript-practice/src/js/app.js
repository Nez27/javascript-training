import Controller from './controllers/index';
import Service from './services/index';
import View from './views/index';
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
