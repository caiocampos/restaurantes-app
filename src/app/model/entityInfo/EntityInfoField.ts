import { EntityInfoFK } from './entityInfoFK';

export class EntityInfoField {
  name: string;
  label: string;
  type: string;
  options: string[];
  fk: EntityInfoFK;
  required: boolean;
  size: number;
}
