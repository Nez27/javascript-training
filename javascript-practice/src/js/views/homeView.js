import CommonView from './commonView';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.overlay = document.querySelector('.overlay');
    this.darkOverlay = document.querySelector('.dark-overlay');
    this.dialog = document.querySelectorAll('.dialog');
    this.cancelBtn = document.querySelectorAll('.form__cancel-btn');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.budgetForm = document.getElementById('budgetForm');
    this.transactionForm = document.getElementById('transactionForm');
    this.categoryForm = document.getElementById('categoryForm');
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
    this.addTransactionBtn.addEventListener('click', () => {
      this.transactionForm.classList.add('active');
      this.toggleActiveOverlay();
    });

    this.addBudgetBtn.addEventListener('click', () => {
      this.budgetForm.classList.add('active');
      this.toggleActiveOverlay();
    });

    this.cancelBtn.forEach((item) => {
      item.addEventListener('click', () => {
        this.hideDialog();
        this.toggleActiveOverlay();
      });
    });

    this.overlay.addEventListener('click', () => {
      this.hideDialog();
    });
  }

  addEventSelectCategoryDialog() {
    this.categoryField.addEventListener('click', () => {
      this.categoryForm.classList.add('active');
      this.toggleDarkOverlayActive();
    });

    this.closeIcon.addEventListener(
      'click',
      this.hideSelectCategoryForm.bind(this),
    );

    this.darkOverlay.addEventListener(
      'click',
      this.hideSelectCategoryForm.bind(this),
    );
  }

  hideSelectCategoryForm() {
    this.categoryForm.classList.remove('active');
    this.toggleDarkOverlayActive();
  }

  toggleDarkOverlayActive() {
    this.darkOverlay.classList.toggle('active');
  }

  hideDialog() {
    this.dialog.forEach((item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
  }

  toggleActiveOverlay() {
    this.overlay.classList.toggle('active');
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
