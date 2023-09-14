/* eslint-disable class-methods-use-this */
import { TYPE_TOAST, BTN_CONTENT, DEFAULT_CATEGORY } from '../constants/config';
import * as MESSAGE from '../constants/message';
import CommonView from './commonView';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import { changeDateFormat, formatNumber } from '../helpers/helpers';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this.saveBtns = document.querySelectorAll('.form__save-btn');
    this.dialogs = document.querySelectorAll('.dialog');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');
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

  // ---------------------SELECTED CATEGORY DIALOG---------------------//
  /**
   * Load category data
   * @param {function} getAllCategory Get all category function
   */
  async loadCategory(getAllCategory) {
    this.listCategory = await getAllCategory();

    if (this.listCategory) {
      this.renderCategoryItem(this.listCategory);
    }
  }

  handlerInputChangeCategoryDialog() {
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
    this.renderCategoryItem(newListCategory);
  }

  renderCategoryItem(listCategory) {
    const listCategoryEl = document.querySelector('.list-category');

    listCategoryEl.innerHTML = ''; // Remove old category item

    listCategory.forEach((category) => {
      const markup = `
        <div class="category-item" value="${category.name}">
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

  // ---------------------ADD BUDGET DIALOG---------------------//
  addHandlerSubmitBudgetForm(saveTransaction, saveWallet) {
    this.budgetDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitBudgetForm(saveTransaction, saveWallet);
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

      this.loadData();

      // Hide loader spinner
      this.toggleLoaderSpinner();

      // Show success message
      this.showSuccessToast(
        MESSAGE.ADD_TRANSACTION_SUCCESS,
        MESSAGE.DEFAULT_MESSAGE,
      );

      document.getElementById('formAddBudget').reset();
    } catch (error) {
      this.initErrorToast(error);
    }
  }

  addHandlerInputChangeBudgetForm() {
    this.budgetDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateBudgetForm(bodyDialog);
    });
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
  addHandlerSubmitWalletForm(saveWallet) {
    this.walletDialog.addEventListener('submit', (e) => {
      e.preventDefault();

      this.submitWalletForm(saveWallet);
    });
  }

  async submitWalletForm(saveWallet) {
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
      this.loadData(); // Load data from database into page
    } catch (error) {
      // Show toast error
      this.initErrorToast(error);
    }

    this.toggleLoaderSpinner();
  }

  addHandlerInputChangeWalletForm() {
    this.walletDialog.addEventListener('input', (e) => {
      const bodyDialog = e.target.closest('.dialog__body');
      this.validateWalletForm(bodyDialog);
    });
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
  initErrorToast(error) {
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
      this.transactionDialog.showModal();
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
  }

  addEventSelectCategoryDialog() {
    this.categoryField.addEventListener('click', () => {
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
