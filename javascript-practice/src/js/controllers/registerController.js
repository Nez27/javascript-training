export default class RegisterController {
  constructor(service, view) {
    this.registerView = view.registerView;
    this.service = service;
  }

  handlerCheckUserExist(email) {
    return this.service.userService.checkUserExist(email);
  }

  handlerSaveUser(user) {
    return this.service.userService.saveUser(user);
  }

  init() {
    if (this.registerView) {
      this.registerView.addHandlerForm(
        this.handlerCheckUserExist.bind(this),
        this.handlerSaveUser.bind(this),
      );
      this.registerView.addHandlerInputFormChange();
    }
  }
}
