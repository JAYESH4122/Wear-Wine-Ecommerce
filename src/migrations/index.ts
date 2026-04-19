import * as migration_20260418_145114 from './20260418_145114';
import * as migration_20260419_163606 from './20260419_163606';

export const migrations = [
  {
    up: migration_20260418_145114.up,
    down: migration_20260418_145114.down,
    name: '20260418_145114',
  },
  {
    up: migration_20260419_163606.up,
    down: migration_20260419_163606.down,
    name: '20260419_163606'
  },
];
