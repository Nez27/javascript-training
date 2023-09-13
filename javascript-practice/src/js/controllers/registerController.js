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

  init() {
    if (this.registerView) {
      this.registerView.addHandlerForm(
        this.handlerCheckUserValid.bind(this),
        this.handlerSaveUser.bind(this),
      );
      this.registerView.addHandlerInputFormChange();
    }
  }
}
