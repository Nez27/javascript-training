import CommonService from './commonService';
import Category from '../models/category';

export default class CategoryService extends CommonService {
  constructor() {
    super();

    this.defaultPath = 'categories/';
  }

  async getAllCategory() {
    const data = await this.getAllDataFromPath(this.defaultPath);
    const listCategory = [];

    if (data) {
      data.forEach((category) => {
        listCategory.unshift(new Category(category));
      });

      return listCategory;
    }

    return null;
  }
}
