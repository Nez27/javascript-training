import { DEFAULT_CATEGORY } from '../constants/config';
import Transaction from '../models/transaction';
import * as MESSAGE from '../constants/message';
import { renderRequiredText } from '../helpers/validateForm';

export default class BudgetView {
  constructor() {
    this.budgetDialog = document.getElementById('budgetDialog');
    this.addBudgetBtn = document.getElementById('addBudget');

    this.handlerEventBudgetView();
  }

  initFunction(
    showErrorToast,
    showSuccessToast,
    toggleLoaderSpinner,
    saveTransaction,
    loadTransactionData,
    updateAmountWallet,
    loadData,
    transform,
  ) {
    this.showErrorToast = showErrorToast;
    this.showSuccessToast = showSuccessToast;
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.saveTransaction = saveTransaction;
    this.loadTransactionData = loadTransactionData;
    this.updateAmountWallet = updateAmountWallet;
    this.loadData = loadData;
    this.transform = transform;
  }

  subscribe() {
    this.transform.create('budgetView', this.updateData.bind(this));
  }

  sendData() {
    const data = { wallet: this.wallet, listTransaction: this.listTransaction };

    this.transform.onSendSignal('budgetView', data);
  }

  updateData(data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransaction = data.listTransactions;

    if (data.listCategory) this.listCategory = data.listCategory;
  }

  addHandlerEventBudgetForm() {
    this.budgetDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleBudgetForm();
      this.submitBudgetForm();
    });

    this.budgetDialog.addEventListener('input', () => {
      this.changeBtnStyle();
      this.clearErrorStyleBudgetForm();
    });
  }

  clearErrorStyleBudgetForm() {
    // Clear error style
    const inputFieldEls =
      this.budgetDialog.querySelectorAll('.form__input-field');
    const errorTexts = this.budgetDialog.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });

    errorTexts.forEach((item) => {
      if (item) item.remove();
    });
  }

  async submitBudgetForm() {
    try {
      const { formAddBudget } = document.forms;
      const form = new FormData(formAddBudget);
      const date = form.get('selected_date');
      const amount = form.get('amount');
      const note = form.get('note');

      // Validate data user input

      if (this.validateBudgetForm(date, amount)) {
        this.toggleLoaderSpinner(); // Enable loader spinner
        this.budgetDialog.close(); // Close dialog

        const transaction = new Transaction({
          categoryName: DEFAULT_CATEGORY.INCOME,
          date,
          amount: +amount,
          note,
          idUser: this.wallet.idUser,
        });

        await this.saveTransaction(transaction);

        // Reload data
        await this.loadTransactionData();
        await this.updateAmountWallet();
        await this.loadData();

        // Hide loader spinner
        this.toggleLoaderSpinner();

        // Show success message
        this.showSuccessToast(
          MESSAGE.ADD_TRANSACTION_SUCCESS,
          MESSAGE.DEFAULT_MESSAGE,
        );

        document.getElementById('formAddBudget').reset();
      }
    } catch (error) {
      this.showErrorToast(error);
    }
  }

  validateBudgetForm(date, amount) {
    const inputFieldEl =
      this.budgetDialog.querySelectorAll('.form__input-field');

    if (!date || !amount) {
      if (!date) {
        renderRequiredText('date', inputFieldEl[0]);
        inputFieldEl[0].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEl[1]);
        inputFieldEl[1].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  changeBtnStyle() {
    const date = this.budgetDialog.querySelector('.input-date').value;
    const amount = +this.budgetDialog.querySelector('.form__input-balance')
      .value;
    const saveBtn = this.budgetDialog.querySelector('.form__save-btn');

    if (date.trim() && amount >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }

  handlerEventBudgetView() {
    this.addBudgetBtn.addEventListener('click', () => {
      // Set default value for date input
      this.budgetDialog.querySelector("[name='selected_date']").valueAsDate =
        new Date();

      this.budgetDialog.showModal();
    });

    this.addHandlerEventBudgetForm();
  }
}
