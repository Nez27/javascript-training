import { MARK_ICON, TYPE_TOAST } from '../constants/variable';

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
    this.toastIcon = document.querySelector('.mark');
    this.toastBtn = document.querySelector('.toast__redirect-btn');
    this.toastTitle = document.querySelector('.toast__title');
    this.toastContent = document.querySelector('.toast__message');
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
    this.toast.classList.forEach((classItem) =>
      classItem === TYPE_TOAST.success || classItem === TYPE_TOAST.error
        ? this.toast.classList.remove(classItem)
        : '',
    );

    // Remove old icon toast if haved
    this.toastIcon.classList.forEach((classItem) =>
      classItem === MARK_ICON.success || classItem === MARK_ICON.error
        ? this.toastIcon.classList.remove(classItem)
        : '',
    );

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
