import { EntityInfoField } from './EntityInfoField';
import { EntityInfoAcess } from './entityInfoAcess';

export class EntityInfo {
  entity: string;
  title: string;
  description: string;
  userAcess: EntityInfoAcess;
  queries: String[];
  fields: EntityInfoField[];
}
