import { module, test } from 'qunit';
import { setupTest } from 'ember-quickstart/tests/helpers';

module('Unit | Route | weekly-monthly-stats', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:weekly-monthly-stats');
    assert.ok(route);
  });
});
