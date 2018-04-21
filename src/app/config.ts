import { User } from './model/user';
import { EntityInfo } from './model/entityInfo/entityInfo';

export class Config {
  static server = 'http://localhost:8085/';
  static user: User = new User();
  static entities: Array<EntityInfo> = new Array;
  static title = 'Restaurante\'s';
}
