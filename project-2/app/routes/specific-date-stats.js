import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SpecificDateStatsRoute extends Route {
  @service firebase;
  @service router;

  async beforeModel() {
    const isAuthenticated = await this.firebase.isAuthenticated();

    if (!isAuthenticated) {
      this.router.transitionTo('index');
    }
  }
}
