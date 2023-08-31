export default class RegisterController {
  constructor(service, view) {
    this.registerView = view.registerView;
    this.service = service;
  }

  hanlderCheckUserExist(email) {
    return this.service.userService.checkUserExist(email);
  }

  handlerSaveUser(user) {
    return this.service.userService.saveUser(user);
  }

  init() {
    if (this.registerView.checkRegisterFormElExist()) {
      this.registerView.addHandlerForm(
        this.hanlderCheckUserExist.bind(this),
        this.handlerSaveUser.bind(this),
      );
      this.registerView.addHandlerInputFormChange();
    }
  }
}
