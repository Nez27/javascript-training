import { TIME_OUT_ERROR } from '../constants/constant';
import { REGEX_PASSWORD, TIME_OUT_SEC } from '../constants/config';
import FirebaseService from '../services/firebaseService';

export const validatePassword = (password) => {
  return REGEX_PASSWORD.test(password);
};

export const timeout = (s) => {
  return new Promise((reject) => {
    setTimeout(() => {
      reject(TIME_OUT_ERROR);
    }, s * 1000);
  });
};

export const timeOutConnect = async (action) => {
  const result = await Promise.race([action, timeout(TIME_OUT_SEC)]);

  if (result && result.status === TIME_OUT_ERROR.status) {
    FirebaseService.disconnect();
    throw new Error(`${result.message}`);
  }

  return result;
};
