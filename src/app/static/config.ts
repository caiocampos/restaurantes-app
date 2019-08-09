import { User } from '../model/user';
import { EntityInfo } from '../model/entityInfo/entity-info';
import { environment } from '../../environments/environment';

const HEROKU_SERVER = 'https://ctp-restaurantes.herokuapp.com/';

export enum Location {
  Local,
  GitHub,
  Other
}

export class Config {
  static Location = Location;
  static location: Location = get_location();
  static server: String = get_server();
  static user: User = new User();
  static entities: Array<EntityInfo> = [];
  static title = 'Restaurante\'s';
}

function get_server(): String {
  if (environment.production) {
    return HEROKU_SERVER;
  } else {
    return `http://${window.location.hostname}:8085/`;
  }
}

function get_location(): Location {
  return window.location.href.includes('github') ? Location.GitHub
    : window.location.href.includes('localhost') ? Location.Local
      : Location.Other;
}
