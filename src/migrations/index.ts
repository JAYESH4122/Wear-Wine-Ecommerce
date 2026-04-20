import * as migration_20260419_174102 from './20260419_174102';
import * as migration_20260420_092741 from './20260420_092741';

export const migrations = [
  {
    up: migration_20260419_174102.up,
    down: migration_20260419_174102.down,
    name: '20260419_174102',
  },
  {
    up: migration_20260420_092741.up,
    down: migration_20260420_092741.down,
    name: '20260420_092741'
  },
];
