import { setupTest } from 'homework-2-stephen-fan/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | todo', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('todo', {});
    assert.ok(model, 'model exists');
  });
});
