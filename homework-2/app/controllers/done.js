import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DoneController extends Controller {
  @service firebase;
  @service router;
  @tracked doneTodos = [];

  constructor() {
    super(...arguments);
    this.loadDoneTodos();
  }

  @action
  async loadDoneTodos() {
    try {
      const isAuthenticated = await this.firebase.isAuthenticated();
      if (isAuthenticated) {
        this.doneTodos = await this.firebase.getDoneTodos();
        console.log('Loaded done todos:', this.doneTodos);
      }
    } catch {
      console.log('Error loading Done Todos');
    }
  }

  @action
  async logout() {
    await this.firebase.logout();
    this.router.transitionTo('index');
  }
}
