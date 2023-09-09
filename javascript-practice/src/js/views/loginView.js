import CommonLoginRegisterView from './commonLoginRegisterView';
import { MESSAGE, TYPE_POPUP, BTN_CONTENT } from '../constants/constant';

export default class LoginView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.loginPage = document.URL.includes('/login');
    this.dialog = document.querySelector('.modal-box');
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
   * Implement error popup in site
   * @param {string} content The content will show in error popup
   */
  initErrorPopup(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_POPUP;
    const content = error.message ? error.message : error;

    this.initPopupContent(TYPE_POPUP.error, title, content, BTN_CONTENT.GOT_IT);

    // Show popup
    this.tooglePopupForm();
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
   * @param {Function} validateUser The function need to be set event
   */
  async submitForm(validateUser, event) {
    try {
      // Load spinner
      this.toogleLoaderSpinner();

      // Get data from form
      const userInput = this.getDataFromForm(event);
      // Check user exist
      const results = await validateUser(userInput.email, userInput.password);

      if (results) {
        window.location.replace('/');

        return;
      }
      throw MESSAGE.ERROR_CREDENTIAL;
    } catch (error) {
      // Show popup error
      this.initErrorPopup(error);
    }
    // Close spinner
    this.toogleLoaderSpinner();
  }

  isLoginPage() {
    return this.loginPage;
  }
}
