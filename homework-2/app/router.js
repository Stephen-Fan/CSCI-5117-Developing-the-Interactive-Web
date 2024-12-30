import EmberRouter from '@ember/routing/router';
import config from 'homework-2-stephen-fan/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('todos');
  this.route('todo', { path: '/todo/:id' });
  this.route('not-found', { path: '/*path' });
  this.route('done');
  this.route('todos-category', { path: '/todos/:category' });
  this.route('done-category', { path: '/done/:category' });
});
