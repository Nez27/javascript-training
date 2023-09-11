import RegisterView from './registerView';
import LoginView from './loginView';
import { getSubdirectoryURL } from '../helpers/helpers';
import { URL } from '../constants/constant';

export default class View {
  constructor() {
    switch (getSubdirectoryURL()) {
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
