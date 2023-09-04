import RegisterView from './registerView';
import LoginView from './loginView';

export default class View {
  constructor() {
    this.registerView = new RegisterView();
    this.loginView = new LoginView();
  }
}
