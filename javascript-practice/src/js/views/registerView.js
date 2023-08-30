import { validatePassword } from '../helpers/helpers';
import * as CONSTANT from '../constants/constant';
import CommonView from './commonView';
import User from '../models/userModel';

export default class RegisterView extends CommonView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.inputField = document.querySelectorAll('.form__input');

    this.messageDefault = CONSTANT.MESSAGE.ERROR_MESSAGE_DEFAULT;
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return user object or null
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
   * Validate user input data
   * @param {Object} account The account object with email, password, passwordConfirm field
   * @returns {boolean} Return true if validate success and return false if validate not success
   */
  validateForm(account) {
    if (account.password === account.passwordConfirm) {
      if (validatePassword(account.passwordConfirm)) {
        return true;
      }
      this.showError(CONSTANT.MESSAGE.PASSWORD_NOT_STRONG);
      return false;
    }
    this.showError(CONSTANT.MESSAGE.PASSWORD_NOT_MATCH);
    return false;
  }

  /**
   * Add event listener for form input
   * @param {Function} handler The function need to be set event
   */
  addHandlerForm(handler) {
    this.parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorMessage();
      handler();
    });
  }

  /**
   * Show error style input password
   */
  changeToStyleErrorInputPassword() {
    // Index = 1 because it should skip email input field
    for (let index = 1; index < this.inputField.length; index += 1) {
      this.inputField[index].style.background = '#ffc3c3';
      this.inputField[index].style.borderColor = '#ce1414';
    }
  }

  /**
   * Clear error style input password
   */
  clearStyleErrorInputPassword() {
    for (let index = 1; index < this.inputField.length; index += 1) {
      this.inputField[index].style.background = '#f5f5f5';
      this.inputField[index].style.borderColor = '#f5f5f5';
    }
  }

  /**
   * Reassign again to check error message element haved on page or not
   */
  reassignVariableErrorMessage() {
    this.errorMessage = document.querySelector('.form__error-message');
  }

  /**
   * Clear error message at form
   */
  clearErrorMessage() {
    this.reassignVariableErrorMessage();

    // If have error message on page, remove it
    if (this.errorMessage) {
      this.errorMessage.remove();
      this.clearStyleErrorInputPassword();
    }
  }

  /**
   * Add event listener for input field at form
   */
  addHandlerInputFormChange() {
    this.parentElement.addEventListener('input', () => {
      this.clearErrorMessage();
    });
  }

  /**
   * Show error message with error style input password.
   * @param {string} message The error message you want show in form.
   */
  showError(message) {
    this.renderError(message);
    this.changeToStyleErrorInputPassword();
  }

  /**
   * Implement register success popup in site
   */
  initRegisterSuccessPopup() {
    const typePopup = CONSTANT.TYPE_POPUP.success;
    const title = 'Register Commpleted';
    const content = 'Please login to continue!';
    const btnContent = 'OK';

    this.initPopupContent(typePopup, title, content, btnContent);
  }

  /**
   * Implement error popup in site
   * @param {string} content The content will show in error popup
   */
  initErrorPopup(content) {
    const typePopup = CONSTANT.TYPE_POPUP.error;
    const title = 'Error';
    const btnContent = 'Got it!';

    this.initPopupContent(typePopup, title, content, btnContent);
  }

  /**
   * Show error message in form
   * @param {*} message The message will show in form
   */
  renderError(message) {
    const markup = `
      <p class="form__error-message">${
        !message ? this.messageDefault : message
      }</p>
    `;

    document
      .querySelector('.form__title')
      .insertAdjacentHTML('afterend', markup);
  }
}
