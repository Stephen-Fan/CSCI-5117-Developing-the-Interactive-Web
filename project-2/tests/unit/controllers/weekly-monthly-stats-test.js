import { module, test } from 'qunit';
import { setupTest } from 'ember-quickstart/tests/helpers';

module('Unit | Controller | weekly-monthly-stats', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:weekly-monthly-stats');
    assert.ok(controller);
  });
});