/* eslint-disable class-methods-use-this */
import {
  TYPE_TOAST,
  BTN_CONTENT,
  DEFAULT_CATEGORY,
  FIRST_ADD_WALLET_NOTE,
  REMOVE_CATEGORY,
} from '../constants/config';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import {
  createTransactionDetailObject,
  formatNumber,
  getAllCategoryNameInTransactions,
  getAllTransactionByCategoryName,
  renderRequiredText,
} from '../helpers/helpers';
import defaultCategoryIcon from '../../assets/images/question-icon.svg';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this.saveBtns = document.querySelectorAll('.form__save-btn');
    this.dialogs = document.querySelectorAll('.dialog');

    this.closeIcon = document.querySelector('.close-icon');

    this.categoryField = document.getElementById('selectCategory');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.amountInputs = document.querySelectorAll('.form__input-balance');

    this.budgetDialog = document.getElementById('budgetDialog');
    this.transactionDialog = document.getElementById('transactionDialog');
    this.categoryDialog = document.getElementById('categoryDialog');
    this.walletDialog = document.getElementById('walletDialog');

    this.transactionForm = document.getElementById('formAddTransaction');
  }

  initFunction(
    getInfoUserLogin,
    getWalletByIdUser,
    getAllCategory,
    getAllTransactions,
    saveWallet,
    saveTransaction,
    clearAccessToken,
    deleteTransaction,
  ) {
    this.getInfoUserLogin = getInfoUserLogin;
    this.getWalletByIdUser = getWalletByIdUser;
    this.getAllCategory = getAllCategory;
    this.getAllTransactions = getAllTransactions;
    this.saveWallet = saveWallet;
    this.saveTransaction = saveTransaction;
    this.clearAccessToken = clearAccessToken;
    this.deleteTransaction = deleteTransaction;
  }

  async loadPage() {
    // Init function

    this.toggleLoaderSpinner();
    const user = await this.getInfoUserLogin();

    if (!user) {
      this.clearAccessToken();
      window.location.replace('/login');
    } else {
      this.user = user;
      this.wallet = await this.getWalletByIdUser(user.id);

      // Check user's wallet if have or not
      if (!this.wallet) {
        // Show add wallet dialog
        this.walletDialog.showModal();
      } else {
        // Init data
        await this.loadTransactionData();
        await this.loadData();

        // Load event page
        this.loadEvent();
      }
    }

    this.toggleLoaderSpinner();
  }

  async loadData() {
    await this.loadWalletUser();
    this.loadSummaryTab();
    await this.loadTransactionTab();
  }

  // ---------------------LOAD DATA---------------------//
  /**
   * Load wallet user
   */
  async loadWalletUser() {
    const wallet = this.wallet
      ? this.wallet
      : await this.getWalletByIdUser(this.user.id);
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const walletNameValue = wallet.walletName;
    const walletAmountValue = wallet.inflow + wallet.outflow;

    const sign = walletAmountValue >= 0 ? '+' : '-';

    this.wallet = wallet; // Make wallet into global variable

    walletName.textContent = walletNameValue;
    walletPrice.textContent = `${sign}$ ${formatNumber(
      Math.abs(walletAmountValue),
    )}`; // Math.abs(walletAmountValue) to keep the value always > 0

    // Update amount wallet into database
    this.saveWallet(this.wallet);
  }

  async updateAmountWallet() {
    let inflow = 0;
    let outflow = 0;

    // Init data first
    this.transactionDetails = this.loadTransactionDetailsData();

    this.transactionDetails.forEach((transaction) => {
      if (transaction.totalAmount >= 0) {
        inflow += transaction.totalAmount;
      } else {
        outflow -= transaction.totalAmount;
      }
    });

    // Reassign value for wallet user;
    this.wallet.inflow = inflow;
    this.wallet.outflow = -outflow;

    await this.saveWallet(this.wallet);
  }

  /**
   * Load category data
   * @param {function} getAllCategory Get all category function
   */
  async loadCategory() {
    if (!this.listCategory) {
      this.listCategory = await this.getAllCategory();
    }

    if (this.listCategory) {
      this.renderCategoryList();
    }
  }

  loadSummaryTab() {
    const inflowValue = document.querySelector('.inflow__text--income');
    const outflowValue = document.querySelector('.outflow__text--outcome');
    const totalValue = document.querySelector('.summary__total');

    const { inflow } = this.wallet;
    const { outflow } = this.wallet;
    const total = inflow + outflow;

    inflowValue.textContent = `+$ ${formatNumber(inflow)}`;
    outflowValue.textContent = `-$ ${formatNumber(Math.abs(outflow))}`;
    totalValue.textContent = `${total >= 0 ? '+' : '-'}$ ${formatNumber(
      Math.abs(total),
    )}`;
  }

  async loadTransactionData() {
    this.listTransactions = await this.getAllTransactions(this.wallet.idUser);
  }

  async loadTransactionTab() {
    // Load category
    await this.loadCategory();

    // Init data first
    this.transactionDetails = this.loadTransactionDetailsData();

    const transactionEl = document.querySelector('.transaction');
    const listTransactionDetailEl =
      transactionEl.querySelector('.transaction__list');

    const markup = [];

    if (this.transactionDetails) {
      this.transactionDetails.forEach((transactionDetail) => {
        markup.push(this.transactionDetailMarkup(transactionDetail));
      });
    }

    listTransactionDetailEl.innerHTML = '';
    listTransactionDetailEl.insertAdjacentHTML('afterbegin', markup.join('\n'));

    // Load event
    this.addEventTransactionItem();
  }

  loadTransactionDetailsData() {
    // Get all category user have in transactions
    const listCategoryInTransaction = getAllCategoryNameInTransactions(
      this.listTransactions,
    );

    // Create transactions details object
    const tempList = listCategoryInTransaction.map((categoryName) => {
      // Get category object from list category has been loaded.
      const category = this.listCategory.filter(
        (item) => item.name === categoryName,
      );

      const transactions = getAllTransactionByCategoryName(
        categoryName,
        this.listTransactions,
      );

      return createTransactionDetailObject(
        Object.assign({}, ...category),
        transactions,
      );
    });

    tempList.sort(
      (a, b) =>
        parseInt(b.transactions[0].id, 10) - parseInt(a.transactions[0].id, 10),
    );

    return tempList;
  }

  transactionDetailMarkup(transactionDetail) {
    const transactionTimeMarkup = () => {
      const listMarkup = [];
      transactionDetail.transactions.forEach((transaction) => {
        const markup = `
          <div class="transaction__time" data-id=${transaction.id}>
            <div class="transaction__details">
              <p class="transaction__day">${transaction.day}</p>
              <div class="transaction__time-details">
                <p class="transaction__date-time">
                  ${transaction.fullDateString}
                </p>
                <p class="transaction__note">${
                  transaction.note === '' ? 'None' : transaction.note
                }</p>
              </div>
            </div>
            <p class="transaction__${
              transaction.amount >= 0 ? 'income' : 'outcome'
            }">${transaction.amount >= 0 ? '+' : '-'}$ ${formatNumber(
              Math.abs(transaction.amount),
            )}</p>
          </div>
        `;

        listMarkup.push(markup);
      });

      return listMarkup.join('\n');
    };

    return `
      <div class="transaction__item">
        <div class="transaction__category">
          <div class="transaction__category-infor">
            <div class="transaction__category-icon-container">
              <img
                class="icon-category"
                src="${transactionDetail.url}"
                alt="Transportation icon category"
              />
            </div>
            <div class="transaction__category-content">
              <p class="transaction__category-name">
                ${transactionDetail.categoryName}
              </p>
              <p class="transaction__total">${
                transactionDetail.totalTransaction
              } Transactions</p>
            </div>
          </div>
          <p class="transaction__category-total">${
            transactionDetail.totalAmount >= 0 ? '+' : '-'
          }$ ${formatNumber(Math.abs(transactionDetail.totalAmount))}</p>
        </div>
        <div class="transaction__line"></div>
        <!-- Transaction time item -->
        ${transactionTimeMarkup()}
      </div>
    `;
  }

  // ---------------------END---------------------//

  // ---------------------TRANSACTION DIALOG---------------------//
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

  initDataTransactionDialog(idTransaction) {
    const transactionArr = this.listTransactions.filter(
      (obj) => obj.id === idTransaction,
    );
    const transaction = Object.assign({}, ...transactionArr);
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
    this.renderCategoryList(this.keySearchCategory);
    this.transactionForm.reset();
  }
  // ---------------------END DIALOG---------------------//

  // ---------------------SELECTED CATEGORY DIALOG---------------------//
  handlerEventCategoryDialog() {
    this.categoryDialog.addEventListener('input', () => {
      setTimeout(() => {
        this.searchCategory();
      }, 300);
    });
  }

  searchCategory() {
    const searchCategoryEl =
      this.categoryDialog.querySelector("[name='category']");
    const searchValue = searchCategoryEl.value.trim().toLowerCase();
    let newListCategory = [];

    if (searchValue) {
      this.listCategory.forEach((category) => {
        const categoryName = category.name.trim().toLowerCase();

        if (categoryName.includes(searchValue)) {
          newListCategory.unshift(category);
        }
      });
    } else {
      newListCategory = this.listCategory;
    }

    // Render category item
    this.renderCategoryList(this.keySearchCategory, newListCategory);
  }

  renderCategoryList(categorySelected, listCategory = this.listCategory) {
    // Remove category name unnecessary
    const newListCategory = listCategory.filter(
      (item) => !REMOVE_CATEGORY.includes(item.name),
    );

    const listCategoryEl = document.querySelector('.list-category');

    listCategoryEl.innerHTML = ''; // Remove old category item

    newListCategory.forEach((category) => {
      const markup = `
        <div class="category-item ${
          category.name === categorySelected ? 'selected' : ''
        }" data-value='${category.name}' data-url='${category.url}'>
          <img
            class="icon-category"
            src="${category.url}"
            alt="${category.name} Icon"
          />
          <p class="name-category">${category.name}</p>
        </div>
      `;

      listCategoryEl.insertAdjacentHTML('afterbegin', markup);
    });
  }

  // ---------------------END DIALOG---------------------//

  // ---------------------ADD BUDGET DIALOG---------------------//
  addHandlerEventBudgetForm() {
    this.budgetDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleBudgetForm();
      this.submitBudgetForm();
    });

    this.budgetDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');

      this.changeBtnStyle(bodyDialog);
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

  changeBtnStyle(bodyDialog) {
    const date = bodyDialog.querySelector('.input-date').value;
    const amount = +bodyDialog.querySelector('.form__input-balance').value;
    const saveBtn = bodyDialog.querySelector('.form__save-btn');

    if (date.trim() && amount >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }
  // ---------------------END DIALOG---------------------//

  // ---------------------WALLET DIALOG--------------------- //
  addHandlerEventWalletForm() {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleWalletDialog();
      this.submitWalletForm();
    });

    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');

      this.changeBtnStyleWalletDialog(bodyDialog);
      this.clearErrorStyleWalletDialog();
    });
  }

  clearErrorStyleWalletDialog() {
    const inputFieldEls =
      this.walletDialog.querySelectorAll('.form__input-field');
    const errorTextEls = this.walletDialog.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });

    errorTextEls.forEach((item) => {
      if (item) item.remove();
    });
  }

  async submitWalletForm() {
    try {
      // Wallet info
      const { walletForm } = document.forms;
      const form = new FormData(walletForm);
      const walletName = form.get('walletName');
      const amount = form.get('amount');

      if (this.validateWalletDialog(walletName, amount)) {
        this.walletDialog.close();
        this.toggleLoaderSpinner();

        this.wallet = new Wallet({
          walletName,
          amount: +amount,
          idUser: this.user.id,
          inflow: +amount,
        });

        await this.saveWallet(this.wallet);

        // Transaction info
        const transaction = new Transaction({
          categoryName: 'Income',
          date: new Date().toISOString().slice(0, 10),
          note: FIRST_ADD_WALLET_NOTE,
          amount: +amount,
          idUser: this.user.id,
        });

        await this.saveTransaction(transaction);

        // Load data and event
        await this.loadTransactionData();
        await this.loadData();
        this.loadEvent();

        this.showSuccessToast(
          MESSAGE.ADD_WALLET_SUCCESS,
          MESSAGE.DEFAULT_MESSAGE,
        );

        await this.loadData(); // Load data from database into page

        this.toggleLoaderSpinner();
      }
    } catch (error) {
      // Show toast error
      this.showErrorToast(error);
      this.toggleLoaderSpinner();
    }
  }

  validateWalletDialog(walletName, amount) {
    const inputFieldEls =
      this.walletDialog.querySelectorAll('.form__input-field');

    if (!walletName || !amount) {
      if (!walletName) {
        renderRequiredText('wallet name', inputFieldEls[0]);
        inputFieldEls[0].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEls[2]);
        inputFieldEls[2].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  changeBtnStyleWalletDialog(bodyDialog) {
    const walletName = bodyDialog.querySelector('.form__input-text').value;
    const amount = bodyDialog.querySelector('.form__input-balance').value;
    const saveBtn = bodyDialog.querySelector('.form__save-btn');

    if (walletName.length >= 3 && amount >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }

  // ---------------------END DIALOG--------------------- //

  showSuccessToast(title, message) {
    const typeToast = TYPE_TOAST.success;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, message, btnContent);

    this.toastDialog.showModal();
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  showErrorToast(error) {
    const title = error.title ? error.title : MESSAGE.DEFAULT_TITLE_ERROR_TOAST;
    const content = error.message ? error.message : error;

    this.initToastContent(TYPE_TOAST.error, title, content, BTN_CONTENT.GOT_IT);

    // Show toast
    this.toastDialog.showModal();
  }

  // ------------------------------- HANDLER EVENT ------------------------------- //

  loadEvent() {
    this.addCommonEventPage();
    this.handlerTabsTransfer();
    this.addEventSelectCategoryDialog();
    this.addEventTransactionItem();
  }

  /**
   * Handle event when click on tabs
   */
  handlerTabsTransfer() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector('.app__line');

        line.style.width = `${e.target.offsetWidth}px`;
        line.style.left = `${e.target.offsetLeft}px`;

        this.allContent.forEach((content) => {
          content.classList.remove('active');
        });
        this.allContent[index].classList.add('active');
      });
    });
  }

  addCommonEventPage() {
    // Add event close dialog when click outside
    this.dialogs.forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close();
        }
      });
    });

    this.addTransactionBtn.addEventListener('click', () => {
      this.showTransactionDialog();
    });

    this.addBudgetBtn.addEventListener('click', () => {
      // Set default value for date input
      this.budgetDialog.querySelector("[name='selected_date']").valueAsDate =
        new Date();

      this.budgetDialog.showModal();
    });

    this.cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllDialog();
      });
    });

    // Prevent input =,-,e into amount input
    this.amountInputs.forEach((item) => {
      item.addEventListener(
        'keypress',
        (e) => ['+', '-', 'e'].includes(e.key) && e.preventDefault(),
      );
    });

    // Prevent user input at category search
    const categorySearchEl = document.querySelector('.category-name');
    categorySearchEl.addEventListener('keydown', (e) => {
      e.preventDefault();
    });

    const logoutBtn = document.querySelector('.logout-text');
    logoutBtn.addEventListener('click', () => {
      this.clearAccessToken();

      window.location.replace('/login');
    });
  }

  showTransactionDialog(idTransaction = null) {
    this.clearInputTransactionForm();

    // Show delete button only if it is a edit form
    const deleteBtn = this.transactionDialog.querySelector('.form__delete-btn');
    deleteBtn.classList.toggle('hide', !idTransaction);

    if (idTransaction) {
      // Init data transaction to dialog
      this.initDataTransactionDialog(idTransaction);
    } else
      this.transactionDialog.querySelector(
        "[name='selected_date']",
      ).valueAsDate = new Date(); // Set default value for date input

    // Change style submit btn
    this.changeBtnStyleTransactionDialog();
    this.transactionDialog.showModal();
  }

  addEventTransactionItem() {
    const transactionItemEl = document.querySelectorAll('.transaction__item');
    if (transactionItemEl) {
      transactionItemEl.forEach((item) => {
        item.addEventListener('click', (e) => {
          const transactionTime = e.target.closest('.transaction__time');
          if (transactionTime) {
            const idTransaction = transactionTime.dataset.id;

            this.showTransactionDialog(idTransaction);
          }
        });
      });
    }
  }

  addEventSelectCategoryDialog() {
    const categoryListEl = document.querySelector('.list-category');
    const categoryIconEl = this.categoryField.querySelector('.category-icon');
    const categoryNameEl = this.categoryField.querySelector('.category-name');

    categoryListEl.addEventListener('click', (e) => {
      const categoryItem = e.target.closest('.category-item');

      if (categoryItem) {
        const { url } = categoryItem.dataset;
        const { value } = categoryItem.dataset;

        // Set url and value into category field in transaction dialog
        categoryIconEl.src = url;
        categoryNameEl.value = value;

        // Close select category dialog
        this.categoryDialog.close();

        // Clear error style for transaction dialog
        this.clearErrorTransactionDialog();
      }
    });

    // Pass value selected to category dialog
    categoryNameEl.addEventListener('click', () => {
      if (categoryNameEl.value) {
        // Make the keyword search category name into global
        this.keySearchCategory = categoryNameEl.value;

        this.renderCategoryList(this.keySearchCategory);
      }
      this.categoryDialog.showModal();
    });

    this.closeIcon.addEventListener('click', () => {
      this.categoryDialog.close();
    });
  }

  closeAllDialog() {
    this.dialogs.forEach((dialog) => {
      dialog.close();
    });
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
