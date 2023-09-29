import { REMOVE_CATEGORY } from '../constants/config';

export default class CategoryView {
  constructor() {
    this.categoryDialog = document.getElementById('categoryDialog');
    this.categoryField = document.getElementById('selectCategory');
    this.closeIcon = document.querySelector('.close-icon');

    this.handlerEventCategoryDialog();
    this.addEventSelectCategoryDialog();
  }

  initFunction(getAllCategory, transform) {
    this.getAllCategory = getAllCategory;
    this.transform = transform;
  }

  sendData() {
    const data = { listCategory: this.listCategory };

    this.transform.onSendSignal('categoryView', data);
  }

  handlerEventCategoryDialog() {
    this.categoryDialog.addEventListener('input', () => {
      setTimeout(() => {
        this.searchCategory();
      }, 300);
    });
  }

  /**
   * Load category data
   * @param {function} getAllCategory Get all category function
   */
  async loadCategory() {
    if (!this.listCategory) {
      this.listCategory = await this.getAllCategory();

      this.sendData();
    }

    if (this.listCategory) {
      this.renderCategoryList();
    }
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

        this.renderCategoryList(this.keySearchCategory);
      }
      this.categoryDialog.showModal();
    });

    this.closeIcon.addEventListener('click', () => {
      this.categoryDialog.close();
    });
  }
}
