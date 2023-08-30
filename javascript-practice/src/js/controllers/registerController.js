export default class RegisterController {
  constructor(service, view) {
    this.view = view;
    this.service = service;
  }

  async controlRegister() {
    try {
      // Load spinner
      this.view.registerView.toogleLoaderSpinner();

      // Get data from form
      const user = this.view.registerView.getDataFromForm();

      // Save user
      if (user) {
        // Check user exist
        const userExist = await this.service.userService.checkExistUserByEmail(
          user.email,
        );
        if (userExist) {
          throw Error('User is exists! Please try another email!');
        } else {
          await this.service.userService.saveUser(user);
          // Show popup success
          this.view.registerView.initRegisterSuccessPopup();
          this.view.registerView.tooglePopupForm();
        }
      }
    } catch (error) {
      // Show popup error
      this.view.registerView.initErrorPopup(error);
      this.view.registerView.tooglePopupForm();
    }

    // Close spinner
    this.view.registerView.toogleLoaderSpinner();
  }

  init() {
    if (this.view.registerView.registerForm !== null) {
      this.view.registerView.addHandlerForm(this.controlRegister.bind(this));
      this.view.registerView.addHandlerInputFormChange();
    }
  }
}
