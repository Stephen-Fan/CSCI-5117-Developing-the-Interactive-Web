import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TodosRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel() {
    // const auth = this.firebase.auth;
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }
  }

  async model() {
    return {
      todos: await this.firebase.getTodos(),
      categories: await this.firebase.getCategories(),
    };
  }
}
