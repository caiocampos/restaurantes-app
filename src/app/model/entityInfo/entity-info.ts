import { EntityInfoField } from './entity-info-field';
import { EntityInfoAccess } from './entity-info-access';

export class EntityInfo {
  entity: string;
  title: string;
  description: string;
  userAcess: EntityInfoAccess;
  queries: String[];
  fields: EntityInfoField[];
}
