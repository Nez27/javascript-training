import CommonView from './commonView';

export default class HomeView extends CommonView {
  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.addBudgetBtn = document.getElementById('addBudget');
    this.dialogs = document.querySelectorAll('.dialog');
    this.cancelBtn = document.querySelectorAll('.form__cancel-btn');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.budgetDialog = document.getElementById('budgetDialog');
    this.transactionDialog = document.getElementById('transactionDialog');
    this.categoryDialog = document.getElementById('categoryDialog');
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

        if (line.classList.contains('left')) {
          HomeView.replaceClassElement('left', 'right', line);
        } else {
          HomeView.replaceClassElement('right', 'left', line);
        }

        this.allContent.forEach((content) => {
          content.classList.remove('active');
        });
        this.allContent[index].classList.add('active');
      });
    });
  }

  static replaceClassElement(oldEl, newEl, el) {
    el.classList.remove(oldEl);
    el.classList.add(newEl);
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
  }

  addEventSelectCategoryDialog() {
    this.categoryField.addEventListener('click', () => {
      this.categoryDialog.showModal();
    });

    this.closeIcon.addEventListener('click', () => {
      this.categoryDialog.close();
    });
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }

  toggleDialog() {
    this.dialog.forEach((item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
  }
}
