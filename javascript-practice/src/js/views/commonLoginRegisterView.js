import CommonView from './commonView';
import * as MESSAGE from '../constants/message';
import { isValidatePassword } from '../helpers/helpers';

export default class CommonLoginRegisterView extends CommonView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.messageDefault = MESSAGE.ERROR_MESSAGE_DEFAULT;
    this.inputPassword = document.querySelector('input[name="password"]');
    this.inputPasswordConfirm = document.querySelector(
      'input[name="password_confirm"]',
    );
  }

  /**
   * Validate user input data
   * @param {Object} account The account object with email, password, passwordConfirm field
   * @returns {boolean} Return true if validate success and return false if validate not success
   */
  isValidateForm(account) {
    if (account.password === account.passwordConfirm) {
      if (isValidatePassword(account.passwordConfirm)) {
        return true;
      }
      this.showError(MESSAGE.PASSWORD_NOT_STRONG);
      return false;
    }
    this.showError(MESSAGE.PASSWORD_NOT_MATCH);
    return false;
  }

  /**
   * Show or hide style error input password
   */
  toggleErrorStyleInputPass() {
    this.inputPassword.classList.toggle('error-input');
    this.inputPasswordConfirm.classList.toggle('error-input');
  }

  /**
   * Clear error message at form
   */
  clearErrorMessage() {
    // Reassign again to check error message element haved on page or not
    this.errorMessageEl = document.querySelector('.form__error-message');

    // If have error message on page, remove it with style error input password
    if (this.errorMessageEl) {
      this.errorMessageEl.remove();
      this.toggleErrorStyleInputPass();
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
    this.toggleErrorStyleInputPass();
  }

  toggleDialog() {
    this.dialog.classList.toggle('active');
  }

  /**
   * Show error message in form
   * @param {string} message The message will show in form
   */
  renderError(message = this.messageDefault) {
    const markup = `
      <p class="form__error-message">${message}</p>
    `;

    document
      .querySelector('.form__title')
      .insertAdjacentHTML('afterend', markup);
  }
}
