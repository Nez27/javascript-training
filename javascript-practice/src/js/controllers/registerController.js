export default class RegisterController {
  constructor(service, view) {
    this.registerView = view.registerView;
    this.service = service;
  }

  async controlRegister() {
    try {
      // Load spinner
      this.registerView.toogleLoaderSpinner();

      // Get data from form
      const user = this.registerView.getDataFromForm();

      // Save user
      if (user) {
        // Check user exist
        const userExist = await this.service.userService.checkUserExist(
          user.email,
        );
        if (userExist) {
          throw Error('User is exists! Please try another email!');
        } else {
          await this.service.userService.saveUser(user);
          // Show popup success
          this.registerView.initRegisterSuccessPopup();
          this.registerView.tooglePopupForm();
        }
      }
    } catch (error) {
      // Show popup error
      this.registerView.initErrorPopup(error);
      this.registerView.tooglePopupForm();
    }

    // Close spinner
    this.registerView.toogleLoaderSpinner();
  }

  init() {
    if (this.registerView.registerForm !== null) {
      this.registerView.addHandlerForm(this.controlRegister.bind(this));
      this.registerView.addHandlerInputFormChange();
    }
  }
}
