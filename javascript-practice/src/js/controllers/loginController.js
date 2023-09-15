export default class LoginController {
  constructor(service, view) {
    this.service = service;
    this.loginView = view.loginView;
  }

  handlerLoginUser(email, password) {
    return this.service.userService.loginUser(email, password);
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
  }

  init() {
    if (this.loginView) {
      this.loginView.loadPage(this.handlerGetInfoUserLogin.bind(this));
      this.loginView.addHandlerForm(this.handlerLoginUser.bind(this));
    }
  }
}
