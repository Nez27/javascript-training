import CommonLoginRegisterView from './commonLoginRegisterView';
import { TYPE_TOAST, BTN_CONTENT } from '../constants/config';
import * as MESSAGE from '../constants/message';

export default class LoginView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.dialog = document.querySelector('.toast');
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  getDataFromForm(event) {
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    this.account = { email, password };

    return this.account;
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  initErrorToast(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_TOAST;
    const content = error.message ? error.message : error;

    this.initToastContent(TYPE_TOAST.error, title, content, BTN_CONTENT.GOT_IT);

    // Show toast
    this.toastDialog.showModal();
  }

  /**
   * Add event listener for form input
   * @param {Function} validateUser The function need to be set event
   */
  addHandlerForm(validateUser) {
    this.parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorMessage();
      this.submitForm(validateUser, e);
    });
  }

  /**
   * The action when submit form
   * @param {Function} loginUser The function need to be set event
   * * @param {event} event The event target
   */
  async submitForm(loginUser, event) {
    try {
      // Load spinner
      this.toggleLoaderSpinner();

      // Get data from form
      const userInput = this.getDataFromForm(event);
      // Check user exist
      const results = await loginUser(userInput.email, userInput.password);

      if (results) {
        window.location.replace('/');

        return;
      }
      throw MESSAGE.ERROR_CREDENTIAL;
    } catch (error) {
      // Show toast error
      this.initErrorToast(error);
    }
    // Close spinner
    this.toggleLoaderSpinner();
  }
}
