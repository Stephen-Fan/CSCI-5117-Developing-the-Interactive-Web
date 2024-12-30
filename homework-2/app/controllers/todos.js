import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TodosController extends Controller {
  @service firebase;
  @service router;
  @service store;
  @tracked newTodoText = '';
  @tracked todos = [];
  @tracked newCategoryText = '';
  @tracked categories = [];

  constructor() {
    super(...arguments);
    this.initializeTodos();
  }

  async initializeTodos() {
    try {
      const isAuthenticated = await this.firebase.isAuthenticated();
      if (isAuthenticated) {
        await this.loadTodos();
        await this.loadCategories();
      } else {
        this.router.transitionTo('index');
      }
    } catch (error) {
      console.error('Error initializing todos:', error);
    }
  }

  @action
  async loadTodos() {
    this.todos = await this.firebase.getTodos();
    // console.log('Fetched todos:', this.todos);
  }

  @action
  async loadCategories() {
    this.categories = await this.firebase.getCategories();
    // this.set('this.model.categories', categories);
  }

  @action
  async createTodo() {
    if (this.newTodoText.trim()) {
      await this.firebase.addTodo(this.newTodoText);
      this.newTodoText = '';
      await this.loadTodos();
      window.location.reload();
    }
  }

  @action
  async createCategory() {
    if (this.newCategoryText.trim()) {
      await this.firebase.addCategory(this.newCategoryText);
      this.newCategoryText = '';
      await this.loadCategories();
      window.location.reload();
    }
  }

  @action
  async markAsDone(todo) {
    await this.firebase.markTodoAsDone(todo.id);
    await this.loadTodos();
    window.location.reload();
  }

  @action
  updateNewTodoText(event) {
    this.newTodoText = event.target.value;
  }

  @action
  updateNewCategoryText(event) {
    this.newCategoryText = event.target.value;
  }

  // @action
  // async deleteCategory(categoryId) {
  //   await this.firebase.deleteCategories(categoryId);
  //   window.location.reload();
  // }
  @action
  async deleteCategory(categoryName, categoryId) {
    if (
      confirm(`Are you sure you want to delete the category "${categoryName}"?`)
    ) {
      try {
        await this.firebase.deleteCategoryAndResetTodos(
          categoryName,
          categoryId,
        );
        alert(`Category "${categoryName}" deleted successfully.`);
        this.loadCategories();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete the category. Please try again.');
      }
    }
  }

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
