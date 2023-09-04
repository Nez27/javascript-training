import CommonLoginRegisterView from './commonLoginRegisterView';
import * as CONSTANT from '../constants/constant';

export default class LoginView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.loginPage = document.getElementById('loginPage');
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  getDataFromForm() {
    const { loginForm } = document.forms;
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    this.account = { email, password };

    return this.account;
  }

  /**
   * Implement error popup in site
   * @param {string} content The content will show in error popup
   */
  initErrorPopup(content) {
    const typePopup = CONSTANT.TYPE_POPUP.error;
    const title = 'Error Credential!';
    const btnContent = 'Got it!';

    this.initPopupContent(typePopup, title, content, btnContent);

    // Show popup
    this.tooglePopupForm();
  }

  /**
   * Add event listener for form input
   * @param {Function} handler The function need to be set event
   */
  addHandlerForm(getUserByEmail, createTokenUser) {
    this.parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorMessage();
      this.submitForm(getUserByEmail, createTokenUser);
    });
  }

  async submitForm(getUserByEmail, createTokenUser) {
    try {
      // Load spinner
      this.toogleLoaderSpinner();

      // Get data from form
      const userInput = this.getDataFromForm();
      // Check user exist
      const user = await getUserByEmail(userInput.email);

      if (user) {
        // If user exist, compare password
        if (userInput.password === user.password) {
          await createTokenUser(user);
          window.location.replace('/');
          return;
        }
      }
      throw Error(CONSTANT.MESSAGE.ERROR_CREDENTIAL);
    } catch (error) {
      // Show popup error
      this.initErrorPopup(error);
    }
    // Close spinner
    this.toogleLoaderSpinner();
  }

  isLoginPage() {
    return this.loginPage !== null;
  }
}
