import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service firebase;
  @service router;

  @tracked isLoggedIn = false;

  constructor() {
    super(...arguments);

    // Set up the auth state listener to track login status
    this.firebase.authReady.then(() => {
      this.isLoggedIn = !!this.firebase.auth.currentUser;
    });

    this.firebase.auth.onAuthStateChanged((user) => {
      this.isLoggedIn = !!user;
    });
  }

  @action
  async login() {
    try {
      await this.firebase.loginWithGoogle();
      this.router.transitionTo('todos');
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  }

  @action
  async logout() {
    try {
      await this.firebase.logout();
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}