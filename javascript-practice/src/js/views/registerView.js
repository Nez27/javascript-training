import { TYPE_TOAST, BTN_CONTENT } from '../constants/config';
import * as MESSAGE from '../constants/message';
import AuthenticationView from './authenticationView';
import User from '../models/user';
import { redirectToLoginPage } from '../helpers/helpers';

export default class RegisterView extends AuthenticationView {
  constructor() {
    super();

    this.dialog = document.querySelector('.toast');
    this.toastBtn = document.querySelector('.toast__redirect-btn');
  }

  async loadPage(getInfoUserLogin) {
    this.toggleLoaderSpinner();

    const user = await getInfoUserLogin();

    if (user) {
      window.location.replace('/');
    }

    this.toggleLoaderSpinner();
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  validateForm() {
    const { registerForm } = document.forms;
    const formData = new FormData(registerForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('password_confirm');

    // Validate user input
    this.listError = []; // Reset list error
    const emailValid = this.validateEmail(email);
    const passwordValid = this.validatePassword(password);
    const passwordConfirmValid = this.validatePasswordConfirm(
      password,
      passwordConfirm,
    );

    // Show error style
    this.emailEl.classList.toggle('error-input', !emailValid);
    this.inputPasswordEl.classList.toggle('error-input', !passwordValid);
    this.inputPasswordConfirmEl.classList.toggle(
      'error-input',
      !passwordConfirmValid,
    );

    if (emailValid && passwordValid && passwordConfirmValid) {
      const user = new User({ email, password, passwordConfirm });

      return user;
    }

    this.showError(this.listError);

    return null;
  }

  /**
   * Implement register success toast in site
   */
  showRegisterSuccessToast() {
    const typeToast = TYPE_TOAST.success;
    const title = MESSAGE.REGISTER_SUCCESS;
    const content = MESSAGE.DEFAULT_MESSAGE;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, content, btnContent);

    // Show toast
    this.toastDialog.showModal();

    // Add event for toast button
    this.toastBtn.addEventListener('click', redirectToLoginPage);
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

    // Remove event for toast button
    this.toastBtn.removeEventListener('click', redirectToLoginPage);
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

      // Get validate form
      const user = this.validateForm();

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

          // Clear form
          document.getElementById('registerForm').reset();
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
