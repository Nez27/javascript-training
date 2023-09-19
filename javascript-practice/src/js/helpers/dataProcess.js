import { changeDateFormat } from './helpers';

export const createId = () => {
  return new Date().getTime();
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
    const results = transactions.map((transaction) => {
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

      return tempData;
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

export const convertModelToDataObject = (model) => {
  const { id, ...data } = model;

  return { id, data };
};

export const convertDataObjectToModel = (data) => {
  const { id, ...object } = data;

  return { id, ...object.data };
};
