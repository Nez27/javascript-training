import RegisterView from './registerView';
import LoginView from './loginView';
import { getURL } from '../helpers/helpers';
import { URL } from '../constants/constant';

export default class View {
  constructor() {
    switch (getURL()) {
      case URL.LOGIN:
        this.loginView = new LoginView();
        break;
      case URL.REGISTER:
        this.registerView = new RegisterView();
        break;
      default:
    }
  }
}
