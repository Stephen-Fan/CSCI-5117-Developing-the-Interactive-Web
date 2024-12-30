import { module, test } from 'qunit';
import { setupTest } from 'homework-2-stephen-fan/tests/helpers';

module('Unit | Route | done-category', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:done-category');
    assert.ok(route);
  });
});
