export default class LoginController {
  constructor(service, view) {
    this.service = service;
    this.loginView = view.loginView;
  }

  handlerValidateUser(email, password) {
    return this.service.userService.validateUser(email, password);
  }

  init() {
    if (this.loginView.isLoginPage()) {
      this.loginView.addHandlerForm(this.handlerValidateUser.bind(this));
    }
  }
}
