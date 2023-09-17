import CommonService from './commonService';
import Category from '../models/category';

export default class CategoryService extends CommonService {
  constructor() {
    super();

    this.defaultPath = 'categories/';
  }

  async getAllCategory() {
    const data = await this.getAllDataFromPath(this.defaultPath);

    if (data) {
      return data.reverse().map((category) => {
        return new Category(category);
      });
    }

    return null;
  }

  async getCategoryByName(nameCategory) {
    const data = await this.getDataFromProp(
      'name',
      nameCategory,
      this.defaultPath,
    );

    if (data) return data;

    return null;
  }
}
