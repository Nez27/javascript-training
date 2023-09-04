export default class LoginController {
  constructor(service, view) {
    this.service = service;
    this.loginView = view.loginView;
  }

  handlerGetUserByEmail(email) {
    return this.service.userService.getUserByEmail(email);
  }

  handlerCreateTokenUser(user) {
    return this.service.userService.createTokenUser(user);
  }

  init() {
    if (this.loginView.isLoginPage()) {
      this.loginView.addHandlerForm(
        this.handlerGetUserByEmail.bind(this),
        this.handlerCreateTokenUser.bind(this),
      );
    }
  }
}
