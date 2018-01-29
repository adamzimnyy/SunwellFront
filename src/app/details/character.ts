import {Item} from './item';
export interface Character {
  name: string;
  items: Item[];
  itemIds: number[];
  itemLevel: number;
  info: string;
  gearscore: number;
}
