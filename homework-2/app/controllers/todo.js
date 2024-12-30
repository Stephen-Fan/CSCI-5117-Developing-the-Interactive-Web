import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TodoController extends Controller {
  @service firebase;
  @service router;
  // @tracked todoText = '';
  @tracked isDone = false;
  // @tracked selectedCategory = null;

  // constructor() {
  //   super(...arguments);
  //   const { todo, categories } = this.model;
  //   this.todoText = todo?.text || '';
  //   this.categoryText = todo?.category || (categories.length === 1 ? categories[0].categoryName : null);
  //   this.isDone = todo?.isDone || false;
  // }

  get todoText() {
    return this.model?.todo.text || '';
  }

  set todoText(value) {
    this.model.todo.text = value;
  }

  get categoryText() {
    return this.model?.todo.category || null;
  }

  set categoryText(value) {
    this.model.todo.category = value;
  }

  @action
  updateTodoText(event) {
    this.todoText = event.target.value;
  }

  @action
  updateCategory(event) {
    this.categoryText = event.target.value;
    // console.log('selected category:', this.seletedCategory);
  }

  @action
  async saveTodo() {
    try {
      const updatedData = {
        text: this.todoText,
        category: this.categoryText,
        isDone: this.isDone,
      };

      await this.firebase.updateTodo(this.model.todo.id, updatedData);
      alert('TODO item updated successfully!');
      // console.log('Saving:', {text: this.todoText, isDone: this.isDone});
      window.location.reload();
      // this.router.transitionTo('todos');
    } catch (error) {
      console.error('Error saving TODO item:', error);
    }
  }

  @action
  async markAsDone() {
    this.isDone = true;
    await this.saveTodo();
  }

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
