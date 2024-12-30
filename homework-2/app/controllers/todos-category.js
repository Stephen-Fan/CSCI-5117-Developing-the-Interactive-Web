import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TodosCategoryController extends Controller {
  @service firebase;
  @service router;
  @service store;
  @tracked newTodoTextInCategory = '';
  @tracked todos = [];

  @action
  async loadTodos() {
    // console.log('before, category:', this.model.category);
    this.todos = await this.firebase.getTodosByCategory(this.model.category);
    console.log('Fetched todos:', this.todos);
  }

  @action
  async createTodoInCategory() {
    if (this.newTodoTextInCategory.trim()) {
      await this.firebase.addTodoInCategory(
        this.newTodoTextInCategory,
        this.model.category,
      );
      this.newTodoTextInCategory = '';
      await this.loadTodos();
      window.location.reload();
    }
  }

  @action
  updateNewTodoTextInCategory(event) {
    this.newTodoTextInCategory = event.target.value;
  }
}
