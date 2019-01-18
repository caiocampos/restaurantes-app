import { EntityInfoFk } from './entity-info-fk';

export class EntityInfoField {
  name: string;
  label: string;
  type: string;
  options: string[];
  fk: EntityInfoFk;
  required: boolean;
  size: number;
}
