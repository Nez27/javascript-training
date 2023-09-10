import { TYPE_POPUP, MESSAGE, BTN_CONTENT } from '../constants/constant';
import CommonLoginRegisterView from './commonLoginRegisterView';
import User from '../models/user';

export default class RegisterView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.dialog = document.querySelector('.modal-box');
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  getDataFromForm() {
    const { registerForm } = document.forms;
    const formData = new FormData(registerForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('password_confirm');

    const account = { email, password, passwordConfirm };

    if (this.validateForm(account)) {
      const user = new User(account);

      return user;
    }

    return null;
  }

  /**
   * Implement register success popup in site
   */
  showRegisterSuccessPopup() {
    const typePopup = TYPE_POPUP.success;
    const title = 'Register Commpleted';
    const content = 'Please login to continue!';
    const btnContent = 'OK';

    this.initPopupContent(typePopup, title, content, btnContent);

    // Show popup
    this.tooglePopupForm();
  }

  /**
   * Implement error popup in site
   * @param {string} content The content will show in error popup
   */
  initErrorPopup(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_POPUP;
    const content = error.message ? error.message : error;

    this.initPopupContent(TYPE_POPUP.error, title, content, BTN_CONTENT.OK);

    // Show popup
    this.tooglePopupForm();
  }

  /**
   * Add event listener for form input
   * @param {Function} handler The function need to be set event
   */
  addHandlerForm(checkExistUser, saveUser) {
    this.parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorMessage();
      this.submitForm(checkExistUser, saveUser);
    });
  }

  async submitForm(checkExistUser, saveUser) {
    try {
      // Load spinner
      this.toogleLoaderSpinner();

      // Get data from form
      const user = this.getDataFromForm();

      // Save user
      if (user) {
        // Check user exist
        const userExist = await checkExistUser(user.email);
        if (userExist) {
          throw Error(MESSAGE.USER_EXIST_ERROR);
        } else {
          await saveUser(user);
          // Show popup success
          this.showRegisterSuccessPopup();
        }
      }
    } catch (error) {
      // Show popup error
      this.initErrorPopup(error);
    }

    // Close spinner
    this.toogleLoaderSpinner();
  }
}
