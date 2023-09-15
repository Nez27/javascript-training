import * as MESSAGE from '../constants/message';
import { TIME_OUT_SEC, REGEX, DAY, MONTH } from '../constants/config';
import FirebaseService from '../services/firebaseService';

/**
 * Validate password
 * @param {string} password Password input
 * @returns {boolean} Return true if validate password success, otherwise return false
 */
export const isValidatePassword = (password) => {
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

export const formatNumber = (number) => {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
};

export const changeDateFormat = (oldFormatDate) => {
  const tempDate = new Date(oldFormatDate);

  const day = DAY[tempDate.getDay() - 1];
  const date = tempDate.getDate();
  const month = MONTH[tempDate.getMonth()];
  const year = tempDate.getFullYear();

  return `${day}, ${date}, ${month}, ${year}`;
};

export const createTransactionDetailObject = (category, transactions) => {
  const totalTransaction = transactions.length;
  const totalAmount = () => {
    let amount = 0;

    transactions.forEach((transaction) => {
      amount += transaction.amount;
    });

    return amount;
  };
  const listTransaction = () => {
    const results = [];

    transactions.forEach((transaction) => {
      const dateParts = changeDateFormat(transaction.date).split(','); // ['Monday', '14', 'September', '2023']
      const day = dateParts[1];
      const fullDateString = `${dateParts[0]}, ${dateParts[2]} ${dateParts[3]}`;
      const tempData = {
        id: transaction.id,
        day,
        fullDateString,
        note: transaction.note,
        amount: transaction.amount,
      };

      results.push(tempData);
    });

    results.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));

    return results;
  };

  return {
    categoryName: category.name,
    url: category.url,
    totalTransaction,
    totalAmount: totalAmount(),
    transactions: listTransaction(),
  };
};

export const getAllCategoryNameInTransactions = (transactions) => {
  const categoryName = new Set();

  transactions.forEach((transaction) =>
    categoryName.add(transaction.categoryName),
  );

  return Array.from(categoryName);
};

export const getAllTransactionByCategoryName = (categoryName, transactions) => {
  const results = transactions.filter((transaction) => {
    return transaction.categoryName === categoryName;
  });

  return results;
};
