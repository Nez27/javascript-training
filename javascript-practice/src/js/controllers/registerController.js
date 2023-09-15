export default class RegisterController {
  constructor(service, view) {
    this.registerView = view.registerView;
    this.service = service;
  }

  handlerCheckUserValid(email) {
    return this.service.userService.isValidUser(email);
  }

  handlerSaveUser(user) {
    return this.service.userService.saveUser(user);
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
  }

  init() {
    if (this.registerView) {
      this.registerView.loadPage(this.handlerGetInfoUserLogin.bind(this));
      this.registerView.addHandlerForm(
        this.handlerCheckUserValid.bind(this),
        this.handlerSaveUser.bind(this),
      );
      this.registerView.addHandlerInputFormChange();
    }
  }
}
