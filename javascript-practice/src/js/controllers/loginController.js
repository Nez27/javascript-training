export default class LoginController {
  constructor(service, view) {
    this.service = service;
    this.loginView = view.loginView;
  }

  handlerLoginUser(email, password) {
    return this.service.userService.loginUser(email, password);
  }

  init() {
    if (this.loginView) {
      this.loginView.addHandlerForm(this.handlerLoginUser.bind(this));
    }
  }
}
