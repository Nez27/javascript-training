import * as MESSAGE from '../constants/message';
import { TIME_OUT_SEC, REGEX } from '../constants/config';
import FirebaseService from '../services/firebaseService';

/**
 * Validate password
 * @param {string} password Password input
 * @returns {boolean} Return true if validate password success, otherwise return false
 */
export const validatePassword = (password) => {
  return REGEX.PASSWORD.test(password);
};

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

export const convertModelToDataObject = (model) => {
  const { id, ...data } = model;

  return { id, data };
};

export const convertDataObjectToModel = (data) => {
  const { id, ...object } = data;

  return { id, ...object.data };
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
