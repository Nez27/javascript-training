import CommonView from './commonView';
import * as MESSAGE from '../constants/message';
import {
  compare2Password,
  isValidPassword,
  isValidateEmail,
  renderRequiredText,
} from '../helpers/validateForm';

export default class AuthenticationView extends CommonView {
  constructor() {
    super();

    this.parentElement = document.querySelector('.form');
    this.emailEl = document.querySelector("[name='email']");
    this.messageDefault = MESSAGE.ERROR_MESSAGE_DEFAULT;
    this.inputPasswordEl = document.querySelector('input[name="password"]');
    this.inputPasswordConfirmEl = document.querySelector(
      'input[name="password_confirm"]',
    );

    this.listError = [];
  }

  /**
   * Validate user input data
   * @param {Object} account The account object with email, password, passwordConfirm field
   * @returns {boolean} Return true if validate success and return false if validate not success
   */
  // isValidateAccount(account) {
  //   if (account.password === account.passwordConfirm) {
  //     if (isValidPassword(account.passwordConfirm)) {
  //       return true;
  //     }
  //     this.showError(MESSAGE.PASSWORD_NOT_STRONG);
  //     return false;
  //   }
  //   this.showError(MESSAGE.PASSWORD_NOT_MATCH);
  //   return false;
  // }

  // eslint-disable-next-line class-methods-use-this
  validateEmail(email) {
    if (email) {
      if (!isValidateEmail(email)) {
        this.listError.push(MESSAGE.INVALID_EMAIL_FORMAT);

        return false;
      }
      return true;
    }

    renderRequiredText('email', this.emailEl);
    return false;
  }

  validatePassword(password) {
    if (password) {
      if (!isValidPassword(password)) {
        this.listError.push(MESSAGE.PASSWORD_NOT_STRONG);

        return false;
      }

      return true;
    }
    renderRequiredText('password', this.inputPasswordEl);

    return false;
  }

  validatePasswordConfirm(password, passwordConfirm) {
    if (passwordConfirm) {
      if (!compare2Password(password, passwordConfirm)) {
        this.listError.push(MESSAGE.PASSWORD_NOT_MATCH);

        return false;
      }

      return true;
    }

    renderRequiredText('confirm password', this.inputPasswordConfirmEl);

    return false;
  }

  /**
   * Clear error message at form
   */
  clearErrorMessage() {
    // Reassign again to check error message element haved on page or not
    this.errorMessageEl = document.querySelector('.form__error-message');
    this.errorTextEl = document.querySelectorAll('.error-text');

    // If have error message on page, remove it with style error input password
    if (this.errorMessageEl || this.errorTextEl.length > 0) {
      if (this.errorMessageEl) this.errorMessageEl.remove();

      if (this.errorTextEl) {
        this.errorTextEl.forEach((item) => {
          item.remove();
        });
      }
      this.emailEl.classList.remove('error-input');
      this.inputPasswordEl.classList.remove('error-input');

      if (this.inputPasswordConfirmEl)
        this.inputPasswordConfirmEl.classList.remove('error-input');
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
  }

  toggleDialog() {
    this.dialog.classList.toggle('active');
  }

  /**
   * Show error message in form
   * @param {string} message The message will show in form
   */
  renderError(messages = this.messageDefault) {
    if (messages.length > 0) {
      const messageItemMarkup = messages
        .map((message) => `<li>${message}</li>`)
        .join('\n');

      const markup = `
      <ul class="form__error-message">
        ${messageItemMarkup}
      </ul>
    `;

      document
        .querySelector('.form__title')
        .insertAdjacentHTML('afterend', markup);
    }
  }
}
