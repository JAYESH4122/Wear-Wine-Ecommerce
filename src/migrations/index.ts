import * as migration_20260418_145114 from './20260418_145114';

export const migrations = [
  {
    up: migration_20260418_145114.up,
    down: migration_20260418_145114.down,
    name: '20260418_145114'
  },
];
