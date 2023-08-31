import { TYPE_POPUP } from '../constants/constant';
import CommonLoginRegisterView from './commonLoginRegisterView';
import User from '../models/userModel';

export default class RegisterView extends CommonLoginRegisterView {
  constructor() {
    super();

    this.registerForm = document.getElementById('registerForm');
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
  initRegisterSuccessPopup() {
    const typePopup = TYPE_POPUP.success;
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
    const typePopup = TYPE_POPUP.error;
    const title = 'Error';
    const btnContent = 'Got it!';

    this.initPopupContent(typePopup, title, content, btnContent);
  }
}
