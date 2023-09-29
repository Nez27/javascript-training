import * as MESSAGE from '../constants/message';
import { renderRequiredText } from '../helpers/validateForm';
import Transaction from '../models/transaction';

import defaultCategoryIcon from '../../assets/images/question-icon.svg';

export default class TransactionView {
  constructor(categoryView) {
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.transactionDialog = document.getElementById('transactionDialog');
    this.transactionForm = document.getElementById('formAddTransaction');

    this.handlerEventTransactionDialog();

    this.categoryView = categoryView;
  }

  initFunction(
    toggleLoaderSpinner,
    deleteTransaction,
    loadTransactionData,
    updateAmountWallet,
    loadData,
    showSuccessToast,
    showErrorToast,
    saveTransaction,
    transform,
  ) {
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.deleteTransaction = deleteTransaction;
    this.loadTransactionData = loadTransactionData;
    this.updateAmountWallet = updateAmountWallet;
    this.loadData = loadData;
    this.showSuccessToast = showSuccessToast;
    this.showErrorToast = showErrorToast;
    this.saveTransaction = saveTransaction;
    this.transform = transform;
  }

  subscribe() {
    this.transform.create('transactionView', this.updateData.bind(this));
  }

  sendData() {
    const data = { wallet: this.wallet, listTransaction: this.listTransaction };

    this.transform.onSendSignal('transactionView', data);
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransactions = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;
  }

  handlerEventTransactionDialog() {
    this.transactionDialog.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorTransactionDialog();
      this.submitTransactionDialog();
    });

    this.transactionDialog.addEventListener('input', () => {
      this.changeBtnStyleTransactionDialog();
      this.clearErrorTransactionDialog();
    });

    // Add delete transaction event
    this.deleteTransactionEvent();

    this.addTransactionBtn.addEventListener('click', () => {
      this.showTransactionDialog();
    });

    this.handlerCategoryFieldEvent();
  }

  handlerCategoryFieldEvent() {
    const categoryField = this.transactionForm.querySelector(
      "[name='category_name']",
    );

    categoryField.addEventListener('click', () => {
      this.clearErrorTransactionDialog();
    });
  }

  clearErrorTransactionDialog() {
    // Clear error style
    const inputFieldEls =
      this.transactionDialog.querySelectorAll('.form__input-field');
    const errorTextEls = this.transactionDialog.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });
    errorTextEls.forEach((item) => {
      if (item) item.remove();
    });
  }

  deleteTransactionEvent() {
    const deleteTransactionBtn =
      this.transactionDialog.querySelector('.form__delete-btn');

    deleteTransactionBtn.addEventListener('click', async () => {
      const idEl = this.transactionDialog.querySelector(
        "[name='id_transaction']",
      );

      if (idEl.value) {
        try {
          this.transactionDialog.close();
          this.toggleLoaderSpinner();

          await this.deleteTransaction(idEl.value);

          // Reload data
          await this.loadTransactionData();
          await this.updateAmountWallet();
          await this.loadData();

          this.showSuccessToast('Delete success!', MESSAGE.DEFAULT_MESSAGE);
        } catch (error) {
          this.showErrorToast(error);
        }
        this.toggleLoaderSpinner();
      }
    });
  }

  changeBtnStyleTransactionDialog() {
    const dateInput = this.transactionDialog.querySelector(
      "[name='selected_date']",
    ).value;
    const categoryName = this.transactionDialog.querySelector(
      "[name='category_name']",
    ).value;
    const amountInput =
      this.transactionDialog.querySelector("[name='amount']").value;
    const saveBtn = this.transactionDialog.querySelector('.form__save-btn');

    saveBtn.classList.toggle(
      'active',
      dateInput && categoryName && amountInput >= 1,
    );
  }

  initValueTransactionDialog(idTransaction) {
    let categoryName;

    if (idTransaction) {
      // Get transaction object
      const transactionArr = this.listTransactions.filter(
        (obj) => obj.id === idTransaction,
      );
      const transaction = Object.assign({}, ...transactionArr);
      // Get category object
      const categoryArr = this.listCategory.filter(
        (obj) => obj.name === transaction.categoryName,
      );
      const category = Object.assign({}, ...categoryArr);

      const idEl = this.transactionDialog.querySelector(
        "[name='id_transaction']",
      );
      const dateEl = this.transactionDialog.querySelector(
        "[name='selected_date']",
      );
      const categoryEl = this.transactionDialog.querySelector(
        "[name='category_name']",
      );
      const amountEl = this.transactionDialog.querySelector("[name='amount']");
      const noteEl = this.transactionDialog.querySelector("[name='note']");
      const iconEl = this.transactionDialog.querySelector('.category-icon');

      idEl.value = transaction.id;
      dateEl.value = transaction.date;
      categoryEl.value = transaction.categoryName;
      amountEl.value = Math.abs(transaction.amount);
      noteEl.value = transaction.note;
      iconEl.src = category.url;

      categoryName = categoryEl.value;
    }

    // Show delete button only if it is a edit form and not a income transaction
    const deleteBtn = this.transactionDialog.querySelector('.form__delete-btn');
    const showDeleteBtn = () => {
      return idTransaction && categoryName !== 'Income';
    };

    deleteBtn.classList.toggle('hide', !showDeleteBtn());
  }

  async submitTransactionDialog() {
    try {
      const dateEl = this.transactionForm.querySelector(
        "[name='selected_date']",
      );
      const categoryNameEl = this.transactionForm.querySelector(
        "[name='category_name']",
      );
      const amountEl = this.transactionForm.querySelector("[name='amount']");
      const noteEl = this.transactionForm.querySelector("[name='note']");
      const idEl = this.transactionForm.querySelector(
        "[name='id_transaction']",
      );
      const amount =
        categoryNameEl.value === 'Income' ? +amountEl.value : -+amountEl.value; // Check if this is a income transaction, amount must plus

      // Validate data user input
      if (
        this.validateTransactionForm(dateEl.value, categoryNameEl.value, amount)
      ) {
        this.toggleLoaderSpinner();
        this.transactionDialog.close();

        const transaction = new Transaction({
          id: idEl.value,
          categoryName: categoryNameEl.value,
          date: dateEl.value,
          amount,
          note: noteEl.value,
          idUser: this.wallet.idUser,
        });

        await this.saveTransaction(transaction);

        // Reload data
        await this.loadTransactionData();
        this.updateAmountWallet();
        await this.loadData();

        if (!idEl.value) {
          // Add success
          this.showSuccessToast(
            MESSAGE.ADD_TRANSACTION_SUCCESS,
            MESSAGE.DEFAULT_MESSAGE,
          );
        } else {
          // Update success
          this.showSuccessToast(
            MESSAGE.UPDATE_TRANSACTION_SUCCESS,
            MESSAGE.DEFAULT_MESSAGE,
          );
        }

        this.toggleLoaderSpinner();
        this.clearInputTransactionForm(this.transactionForm);
      }
    } catch (error) {
      this.showErrorToast(error);
      this.toggleLoaderSpinner();
    }
  }

  validateTransactionForm(date, categoryName, amount) {
    const inputFieldEls =
      this.transactionDialog.querySelectorAll('.form__input-field');

    if (!date || !categoryName || !amount) {
      if (!date) {
        renderRequiredText('date', inputFieldEls[0]);
        inputFieldEls[0].classList.add('error-input');
      }

      if (!categoryName) {
        renderRequiredText('category', inputFieldEls[1]);
        inputFieldEls[1].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEls[2]);
        inputFieldEls[2].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  clearInputTransactionForm() {
    const categoryIcon = this.transactionForm.querySelector('.category-icon');

    categoryIcon.src = defaultCategoryIcon;
    this.keySearchCategory = null; // Delete keyword search
    this.categoryView.renderCategoryList(
      this.keySearchCategory,
      this.listCategory,
    );
    this.transactionForm.reset();
  }

  showTransactionDialog(idTransaction = null) {
    this.clearInputTransactionForm();

    // Init data transaction to dialog
    this.initValueTransactionDialog(idTransaction);

    if (!idTransaction)
      this.transactionDialog.querySelector(
        "[name='selected_date']",
      ).valueAsDate = new Date(); // Set default value for date input

    // Change style submit btn
    this.changeBtnStyleTransactionDialog();
    this.transactionDialog.showModal();
  }
}
