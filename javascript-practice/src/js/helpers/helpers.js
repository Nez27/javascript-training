import { TIME_OUT_SEC, TIME_OUT_ERROR, regex } from '../constants/constant';
import FirebaseService from '../services/firebaseService';

export const validatePassword = (password) => {
  return regex.test(password);
};

export const timeout = (s) => {
  return new Promise((reject) => {
    setTimeout(() => {
      reject(TIME_OUT_ERROR);
    }, s * 1000);
  });
};

export const createIdUser = () => {
  return new Date().getTime();
};

export const timeOutConnect = async (action) => {
  const result = await Promise.race([action, timeout(TIME_OUT_SEC)]);

  if (result && result.status === TIME_OUT_ERROR.status) {
    FirebaseService.disconnect();
    throw new Error(`${result.message}`);
  }

  return result;
};
