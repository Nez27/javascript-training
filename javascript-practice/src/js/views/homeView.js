/* eslint-disable class-methods-use-this */
import { TYPE_TOAST, BTN_CONTENT, DEFAULT_CATEGORY } from '../constants/config';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import {
  createTransactionDetailObject,
  formatNumber,
  getAllCategoryNameInTransactions,
  getAllTransactionByCategoryName,
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
    isValidWallet,
    getWalletByIdUser,
    getAllCategory,
    getAllTransactions,
    saveWallet,
    saveTransaction,
    clearAccessToken,
    deleteTransaction,
  ) {
    this.getInfoUserLogin = getInfoUserLogin;
    this.isValidWallet = isValidWallet;
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
      const wallet = await this.isValidWallet(user.id);

      // Check user's wallet if have or not
      if (!wallet) {
        // Show add wallet dialog
        this.walletDialog.showModal();
      } else {
        // Init data
        await this.loadData();

        // Load event page
        this.loadEvent();
      }
    }

    this.toggleLoaderSpinner();
  }

  async loadData() {
    await this.loadWalletUser();
    await this.loadTransactionData();
    await this.loadCategory(this.getAllCategory);
    this.loadSummaryTab();
    this.loadTransactionTab();
  }

  // ---------------------LOAD DATA---------------------//
  /**
   * Load wallet user
   */
  async loadWalletUser() {
    const wallet = await this.getWalletByIdUser(this.user.id);
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const sign = wallet.amount >= 0 ? '+' : '-';
    const walletNameValue = wallet.walletName;
    // Math.abs(wallet.amount) to keep the value always > 0
    const walletAmountValue = formatNumber(Math.abs(wallet.amount));

    this.wallet = wallet; // Make wallet into global variable

    walletName.textContent = walletNameValue;
    walletPrice.textContent = `${sign}$ ${walletAmountValue}`;
  }

  async updateAmountWallet(amount, saveWallet) {
    this.wallet.amount += amount;

    if (amount > 0) {
      this.wallet.inflow += amount;
    } else {
      this.wallet.outflow -= amount;
    }

    await saveWallet(this.wallet);
  }

  /**
   * Load category data
   * @param {function} getAllCategory Get all category function
   */
  async loadCategory(getAllCategory) {
    this.listCategory = await getAllCategory();

    if (this.listCategory) {
      this.renderCategoryItem();
    }
  }

  loadSummaryTab() {
    const inflowValue = document.querySelector('.inflow__text--income');
    const outflowValue = document.querySelector('.outflow__text--outcome');
    const totalValue = document.querySelector('.summary__total');

    const { inflow } = this.wallet;
    const { outflow } = this.wallet;
    const total = inflow - outflow;

    inflowValue.textContent = `+$ ${formatNumber(inflow)}`;
    outflowValue.textContent = `-$ ${formatNumber(outflow)}`;
    totalValue.textContent = `${total >= 0 ? '+' : '-'}$ ${formatNumber(
      Math.abs(total),
    )}`;
  }

  async loadTransactionData() {
    this.listTransactions = await this.getAllTransactions(this.wallet.idUser);
  }

  async loadTransactionTab() {
    // Init data first
    const transactionDetails = this.loadTransactionDetailsData();
    const transactionEl = document.querySelector('.transaction');
    const listTransactionDetailEl =
      transactionEl.querySelector('.transaction__list');

    const markup = [];

    if (transactionDetails) {
      transactionDetails.forEach((transactionDetail) => {
        markup.push(this.transactionDetailMarkup(transactionDetail));
      });
    }

    listTransactionDetailEl.innerHTML = '';
    listTransactionDetailEl.insertAdjacentHTML('afterbegin', markup.join('\n'));
  }

  loadTransactionDetailsData() {
    // Get all category user have in transactions
    const listCategoryInTransaction = getAllCategoryNameInTransactions(
      this.listTransactions,
    );

    // Create transactions details object
    const tempList = [];

    listCategoryInTransaction.forEach((categoryName) => {
      // Get category object from list category has been loaded.
      const category = this.listCategory.filter(
        (item) => item.name === categoryName,
      );

      const transactions = getAllTransactionByCategoryName(
        categoryName,
        this.listTransactions,
      );

      tempList.push(
        createTransactionDetailObject(
          Object.assign({}, ...category),
          transactions,
        ),
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
      this.submitTransactionDialog();
    });

    this.transactionDialog.addEventListener('input', () => {
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
    });

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

          this.showSuccessToast('Delete success!', MESSAGE.DEFAULT_MESSAGE);

          await this.loadData();
          this.addEventTransactionItem();
        } catch (error) {
          this.showErrorToast(error);
        }
        this.toggleLoaderSpinner();
      }
    });
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
    this.toggleLoaderSpinner();
    this.transactionDialog.close();

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
      const transaction = new Transaction({
        id: idEl.value,
        categoryName: categoryNameEl.value,
        date: dateEl.value,
        amount: -+amountEl.value,
        note: noteEl.value,
        idUser: this.wallet.idUser,
      });

      await this.saveTransaction(transaction);

      // Update wallet info
      this.updateAmountWallet(-+amountEl.value, this.saveWallet);

      this.showSuccessToast(
        MESSAGE.ADD_TRANSACTION_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      this.clearInputTransactionForm(this.transactionForm);

      // Reload data
      await this.loadData();
      this.addEventTransactionItem();
    } catch (error) {
      this.showErrorToast(error);
    }

    this.toggleLoaderSpinner();
  }

  clearInputTransactionForm() {
    const categoryIcon = this.transactionForm.querySelector('.category-icon');

    categoryIcon.src = defaultCategoryIcon;

    this.keySearchCategory = null; // Delete keyword search

    this.renderCategoryItem(this.keySearchCategory);

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
    this.renderCategoryItem(this.keySearchCategory, newListCategory);
  }

  renderCategoryItem(categorySelected, listCategory = this.listCategory) {
    const listCategoryEl = document.querySelector('.list-category');

    listCategoryEl.innerHTML = ''; // Remove old category item

    listCategory.forEach((category) => {
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

      this.submitBudgetForm();
    });

    this.budgetDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateBudgetForm(bodyDialog);
    });
  }

  async submitBudgetForm() {
    try {
      this.toggleLoaderSpinner(); // Enable loader spinner
      this.budgetDialog.close(); // Close dialog

      const { formAddBudget } = document.forms;
      const form = new FormData(formAddBudget);
      const date = form.get('date');
      const amount = form.get('amount');
      const note = form.get('note');

      const transaction = new Transaction({
        categoryName: DEFAULT_CATEGORY.INCOME,
        date,
        amount: +amount,
        note,
        idUser: this.wallet.idUser,
      });

      await this.saveTransaction(transaction);

      await this.updateAmountWallet(+amount, this.saveWallet); // Update wallet

      await this.loadData();
      this.addEventTransactionItem();

      // Hide loader spinner
      this.toggleLoaderSpinner();

      // Show success message
      this.showSuccessToast(
        MESSAGE.ADD_TRANSACTION_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      document.getElementById('formAddBudget').reset();
    } catch (error) {
      this.showErrorToast(error);
    }
  }

  validateBudgetForm(bodyDialog) {
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

      this.submitWalletForm();
    });

    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateWalletForm(bodyDialog);
    });
  }

  async submitWalletForm() {
    this.walletDialog.close();
    this.toggleLoaderSpinner();

    try {
      const { walletForm } = document.forms;
      const form = new FormData(walletForm);
      const walletName = form.get('walletName');
      const amount = form.get('amount');

      const wallet = new Wallet({
        walletName,
        amount: +amount,
        idUser: this.user.id,
        inflow: +amount,
      });

      await this.saveWallet(wallet);

      this.showSuccessToast(
        MESSAGE.ADD_WALLET_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      await this.loadData(); // Load data from database into page
    } catch (error) {
      // Show toast error
      this.showErrorToast(error);
    }

    this.toggleLoaderSpinner();
  }

  validateWalletForm(bodyDialog) {
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
      tab.addEventListener('click', () => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector('.app__line');

        line.classList.toggle('right', line.classList.contains('left'));
        line.classList.toggle('left', !line.classList.contains('right'));

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

    const deleteBtn = this.transactionDialog.querySelector('.form__delete-btn');
    deleteBtn.classList.toggle('hide', !idTransaction);

    if (idTransaction) this.initDataTransactionDialog(idTransaction);

    this.transactionDialog.showModal();
  }

  addEventTransactionItem() {
    const transactionItemEl = document.querySelectorAll('.transaction__item');
    if (transactionItemEl) {
      transactionItemEl.forEach((item) => {
        item.addEventListener('click', (e) => {
          const transactionTime = e.target.closest('.transaction__time');
          const idTransaction = transactionTime.dataset.id;

          this.showTransactionDialog(idTransaction);
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
      }
    });

    // Pass value selected to category dialog
    categoryNameEl.addEventListener('click', () => {
      if (categoryNameEl.value) {
        // Make the keyword search category name into global
        this.keySearchCategory = categoryNameEl.value;

        this.renderCategoryItem(this.keySearchCategory);
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
