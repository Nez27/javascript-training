/* eslint-disable class-methods-use-this */
import { TYPE_TOAST, BTN_CONTENT, DEFAULT_CATEGORY } from '../constants/config';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import { changeDateFormat, formatNumber } from '../helpers/helpers';
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
  }

  async loadPage(
    getInfoUserLogin,
    isValidWallet,
    getWalletByIdUser,
    getAllCategory,
  ) {
    this.getWalletByIdUser = getWalletByIdUser; // Init function
    this.toggleLoaderSpinner();
    const user = await getInfoUserLogin();

    if (!user) {
      window.location.replace('/login');
    } else {
      this.user = user;
      const wallet = await isValidWallet(user.id);

      // Check user's wallet if have or not
      if (!wallet) {
        // Show add wallet dialog
        this.walletDialog.showModal();
      } else {
        // Load event page
        this.loadEvent();

        // Init data
        this.loadData(getAllCategory);
      }
    }

    this.toggleLoaderSpinner();
  }

  async loadData(getAllCategory) {
    await this.loadWalletUser();
    await this.loadCategory(getAllCategory);
  }

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
    this.wallet.amount += +amount;

    await saveWallet(this.wallet);
  }

  // ---------------------TRANSACTIONS DIALOG---------------------//
  handlerEventTransactionDialog(saveTransaction) {
    this.transactionDialog.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitTransactionDialog(saveTransaction);
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
  }

  async submitTransactionDialog(saveTransaction) {
    this.toggleLoaderSpinner();
    this.transactionDialog.close();

    try {
      const transactionForm = document.getElementById('formAddTransaction');
      const dateEl = transactionForm.querySelector("[name='selected_date']");
      const categoryNameEl = transactionForm.querySelector(
        "[name='category_name']",
      );
      const amountEl = transactionForm.querySelector("[name='amount']");
      const noteEl = transactionForm.querySelector("[name='note']");
      const transaction = new Transaction({
        categoryName: categoryNameEl.value,
        date: dateEl.value,
        amount: +amountEl.value,
        note: noteEl.value,
      });

      await saveTransaction(transaction);

      this.showSuccessToast(
        MESSAGE.ADD_TRANSACTION_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      this.clearInputTransactionForm(transactionForm);
    } catch (error) {
      this.showErrorToast(error);
    }

    this.toggleLoaderSpinner();
  }

  clearInputTransactionForm(transactionForm) {
    const categoryIcon = transactionForm.querySelector('.category-icon');

    categoryIcon.src = defaultCategoryIcon;

    this.keySearchCategory = null; // Delete keyword search

    this.renderCategoryItem(this.keySearchCategory);

    transactionForm.reset();
  }
  // ---------------------END DIALOG---------------------//

  // ---------------------SELECTED CATEGORY DIALOG---------------------//
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
  addHandlerEventBudgetForm(saveTransaction, saveWallet) {
    this.budgetDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitBudgetForm(saveTransaction, saveWallet);
    });

    this.budgetDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateBudgetForm(bodyDialog);
    });
  }

  async submitBudgetForm(saveTransaction, saveWallet) {
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
        date: changeDateFormat(date),
        amount: +amount,
        note,
      });

      await saveTransaction(transaction);

      await this.updateAmountWallet(+amount, saveWallet); // Update wallet

      this.loadWalletUser();

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
  addHandlerEventWalletForm(saveWallet, getAllCategory) {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitWalletForm(saveWallet, getAllCategory);
    });

    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateWalletForm(bodyDialog);
    });
  }

  async submitWalletForm(saveWallet, getAllCategory) {
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
      });

      await saveWallet(wallet);

      this.showSuccessToast(
        MESSAGE.ADD_WALLET_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      this.loadEvent(); // Load event page
      this.loadData(getAllCategory); // Load data from database into page
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
  }

  showTransactionDialog(editMode = false) {
    const deleteBtn = this.transactionDialog.querySelector('.form__delete-btn');

    deleteBtn.classList.toggle('hide', !editMode);

    this.transactionDialog.showModal();
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
