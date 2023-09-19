import { REGEX } from '../constants/config';
import * as MESSAGE from '../constants/message';

/**
 * Validate password
 * @param {string} password Password input
 * @returns {boolean} Return true if validate password success, otherwise return false
 */
export const isValidPassword = (password) => {
  return REGEX.PASSWORD.test(password);
};

export const isValidateEmail = (email) => {
  return String(email).toLowerCase().match(REGEX.EMAIL);
};

export const compare2Password = (password, passwordConfirm) => {
  return password === passwordConfirm;
};

export const renderRequiredText = (field, element) => {
  const markup = `
    <p class="error-text">${MESSAGE.REQUIRED_MESSAGE(field)}</p>
  `;

  element.insertAdjacentHTML('afterend', markup);
};
