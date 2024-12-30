import { module, test } from 'qunit';
import { setupTest } from 'homework-2-stephen-fan/tests/helpers';

module('Unit | Controller | done', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:done');
    assert.ok(controller);
  });
});
