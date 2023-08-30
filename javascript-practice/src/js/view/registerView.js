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

  // Function get data from form
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

  // Handler event submit form
  addHandlerForm(handler) {
    this.parentElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorMessage();
      handler();
    });
  }

  changeToStyleErrorInputPassword() {
    for (let index = 1; index < this.inputField.length; index += 1) {
      this.inputField[index].style.background = '#ffc3c3';
      this.inputField[index].style.borderColor = '#ce1414';
    }
  }

  clearStyleErrorInputPassword() {
    for (let index = 1; index < this.inputField.length; index += 1) {
      this.inputField[index].style.background = '#f5f5f5';
      this.inputField[index].style.borderColor = '#f5f5f5';
    }
  }

  // Reassign again to check error message element haved on page or not
  reassignVariableErrorMessage() {
    this.errorMessage = document.querySelector('.form__error-message');
  }

  clearErrorMessage() {
    this.reassignVariableErrorMessage();

    // If have error message on page, remove it
    if (this.errorMessage) {
      this.errorMessage.remove();
      this.clearStyleErrorInputPassword();
    }
  }

  addHandlerInputFormChange() {
    this.parentElement.addEventListener('input', () => {
      this.clearErrorMessage();
    });
  }

  showError(message) {
    this.renderError(message);
    this.changeToStyleErrorInputPassword();
  }

  initRegisterSuccessPopup() {
    const typeForm = CONSTANT.TYPE_FORM.success;
    const title = 'Register Commpleted';
    const content = 'Please login to continue!';
    const btnContent = 'OK';

    this.initPopupContent(typeForm, title, content, btnContent);
  }

  initErrorPopup(content) {
    const typeForm = CONSTANT.TYPE_FORM.error;
    const title = 'Error';
    const btnContent = 'Got it!';

    this.initPopupContent(typeForm, title, content, btnContent);
  }

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
