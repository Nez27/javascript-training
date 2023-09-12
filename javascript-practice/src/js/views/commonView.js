import { MARK_ICON, TYPE_TOAST } from '../constants/config';

export default class CommonView {
  constructor() {
    this.initToast();
    this.initElementToast();
    this.initLoader();
    this.handleEventToast();
  }

  /**
   * Implement toast in site
   */
  initToast() {
    this.rootElement = document.querySelector('body');

    const markup = `
      <dialog class="dialog">
        <div class="toast">
          <div class="mark"></div>
          <h2 class="toast__title"></h2>
          <p class="toast__message"></p>
          <button class="toast__redirect-btn">OK</button>
        </div>
      </dialog>
    `;

    this.rootElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Assign element in toast to property
   */
  initElementToast() {
    this.toastDialog = document.querySelector('.dialog');
    this.toast = document.querySelector('.toast');
    this.toastIcon = this.toast.querySelector('.mark');
    this.toastBtn = this.toast.querySelector('.toast__redirect-btn');
    this.toastTitle = this.toast.querySelector('.toast__title');
    this.toastContent = this.toast.querySelector('.toast__message');
  }

  /**
   * Show or hide loader screen
   */
  toggleLoaderSpinner() {
    this.spinner.classList.toggle('hidden');
  }

  /**
   * Add toast content
   * @param {TYPE_TOAST} typeToast Type of the toast
   * @param {string} title Title of toast
   * @param {string} content Content of toast
   * @param {string} btnContent Content of button
   */
  initToastContent(typeToast, title, content, btnContent) {
    // Remove old typeToast class if haved
    Object.keys(TYPE_TOAST).forEach((value) => {
      CommonView.removeClassElement(value, this.toast);
    });

    // Remove old icon toast if haved
    Object.keys(MARK_ICON).forEach((value) => {
      CommonView.removeClassElement(value, this.toastIcon);
    });

    // Init content toast
    this.toast.classList.add(
      typeToast === TYPE_TOAST.success ? TYPE_TOAST.success : TYPE_TOAST.error,
    );
    this.toastIcon.classList.add(
      typeToast === TYPE_TOAST.success ? MARK_ICON.success : MARK_ICON.error,
    );
    this.toastTitle.textContent = title;
    this.toastContent.textContent = content;
    this.toastBtn.textContent = btnContent;
  }

  static removeClassElement(classEl, el) {
    if (el.classList.contains(classEl)) {
      el.classList.remove(classEl);
    }
  }

  /**
   * Add event listener for toast
   */
  handleEventToast() {
    this.toastBtn.addEventListener('click', () => {
      this.toastDialog.close();
    });

    // Add event close dialog when click outside
    this.toastDialog.addEventListener('click', (e) => {
      const dialogDimensions = this.toastDialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        this.toastDialog.close();
      }
    });
  }

  /**
   * Implement loader screen
   */
  initLoader() {
    const markup = `<div class="loader hidden"></div>`;

    this.rootElement.insertAdjacentHTML('afterbegin', markup);

    // Init element
    this.spinner = document.querySelector('.loader');
  }
}
