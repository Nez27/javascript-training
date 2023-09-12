import { TYPE_TOAST, BTN_CONTENT } from '../constants/variable';
import * as MESSAGE from '../constants/message';
import CommonLoginRegisterView from './commonLoginRegisterView';
import User from '../models/user';

export default class RegisterView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.dialog = document.querySelector('.toast');
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
   * Implement register success toast in site
   */
  showRegisterSuccessToast() {
    const typeToast = TYPE_TOAST.success;
    const title = 'Register Commpleted';
    const content = 'Please login to continue!';
    const btnContent = 'OK';

    this.initToastContent(typeToast, title, content, btnContent);

    // Show toast
    this.toastDialog.showModal();
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  initErrorToast(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_TOAST;
    const content = error.message ? error.message : error;

    this.initToastContent(TYPE_TOAST.error, title, content, BTN_CONTENT.OK);

    // Show toast
    this.toastDialog.showModal();
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
      this.toggleLoaderSpinner();

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
          // Show toast success
          this.showRegisterSuccessToast();
        }
      }
    } catch (error) {
      // Show toast error
      this.initErrorToast(error);
    }

    // Close spinner
    this.toggleLoaderSpinner();
  }
}
