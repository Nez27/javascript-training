import RegisterView from './registerView';
import LoginView from './loginView';
import { getURL } from '../helpers/helpers';
import { URL } from '../constants/constant';
import HomeView from './homeView';

export default class View {
  constructor() {
    switch (getURL()) {
      case URL.LOGIN:
        this.loginView = new LoginView();
        break;
      case URL.REGISTER:
        this.registerView = new RegisterView();
        break;
      case URL.HOME:
        this.homeView = new HomeView();
        break;
      default:
    }
  }
}
