import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DoneCategoryRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel(transition) {
    // const auth = this.firebase.auth;
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }

    const { category } = transition.to.params;
    const categories = await this.firebase.getCategories();
    const isValidCategory = categories.some((c) => c.categoryName === category);

    if (!isValidCategory) {
      this.router.transitionTo('/*path');
    }
  }

  async model(params) {
    const category = params.category;
    // console.log('category passed to model:', category);
    return {
      todos: await this.firebase.getDoneTodosByCategory(category),
      category,
    };
  }
}
