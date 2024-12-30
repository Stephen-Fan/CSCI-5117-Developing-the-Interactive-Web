import Model, { attr } from '@ember-data/model';

export default class TodoModel extends Model {
  @attr('string') text;
  @attr('boolean') isDone;
  @attr('date') createdAt;
}
