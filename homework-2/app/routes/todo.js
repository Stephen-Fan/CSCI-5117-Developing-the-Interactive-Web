import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TodoRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel(transition) {
    // const auth = this.firebase.auth;
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }

    const todo = transition.to.params.id;
    const todos = await this.firebase.getAllTodos();
    const isValidTodo = todos.some((c) => c.id === todo);
    // console.log('transition:', transition);
    // console.log('todo:', todo);
    // console.log('todos:', todos);
    // console.log('isValidTodo:', isValidTodo);
    if (!isValidTodo) {
      this.router.transitionTo('/*path');
    }
  }

  async model(params) {
    const user = this.firebase.getCurrentUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    // console.log('Authenticated user ID:', user.uid);
    // console.log('Fetching todo ID:', params.id);
    const todo = await this.firebase.getTodoById(params.id);
    const categories = await this.firebase.getCategories();
    return { todo, categories };
  }
}
