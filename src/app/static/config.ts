import { User } from '../model/user';
import { EntityInfo } from '../model/entityInfo/entity-info';

export class Config {
  static server = `http://${window.location.hostname}:8085/`;
  static user: User = new User();
  static entities: Array<EntityInfo> = [];
  static title = 'Restaurante\'s';
}
