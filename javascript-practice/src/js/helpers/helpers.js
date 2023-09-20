import * as MESSAGE from '../constants/message';
import { TIME_OUT_SEC, DAY, MONTH } from '../constants/config';
import FirebaseService from '../services/firebaseService';

/**
 * A waiting function with s second
 * @param {number} s The time will be waiting
 * @returns {Promise} A Promise will be only reject after s second
 */
export const timeout = (s) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      FirebaseService.disconnect();
      reject(MESSAGE.TIME_OUT_ERROR);
    }, s * 1000);
  });
};

/**
 * A function waiting the action need to be perform and throw error after s second.
 * @param {Function} action The action need to be perform.
 * @returns { Object || Error } Return the any object from Firebase or Error
 */
export const timeOutConnect = async (action) => {
  const result = await Promise.race([action, timeout(TIME_OUT_SEC)]);

  return result;
};

/**
 * A function create token for user
 * @returns {string} Return token string
 */
export const createToken = () => {
  const lengthToken = 36;
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < lengthToken; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

export const getSubdirectoryURL = () => {
  const url = window.location.href;
  const parts = url.split('/'); // Results: ['http:', '', 'example.com', '']
  const subDirectory = parts[3]; // Get subdirectory url only
  const index = subDirectory.indexOf('?'); // Remove query behind subDirectory

  if (index !== -1) {
    return subDirectory.substring(0, index);
  }

  return subDirectory;
};

export const formatNumber = (number) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
};

export const changeDateFormat = (oldFormatDate) => {
  const tempDate = new Date(oldFormatDate);

  const day = DAY[tempDate.getDay()];
  const date = tempDate.getDate();
  const month = MONTH[tempDate.getMonth()];
  const year = tempDate.getFullYear();

  return `${day}, ${date}, ${month}, ${year}`;
};

export const redirectToLoginPage = () => {
  window.location.replace('/login');
};
