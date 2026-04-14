import * as migration_20260414_120000 from './20260414_120000';
import * as migration_20260414_172922 from './20260414_172922';

export const migrations = [
  {
    up: migration_20260414_120000.up,
    down: migration_20260414_120000.down,
    name: '20260414_120000',
  },
  {
    up: migration_20260414_172922.up,
    down: migration_20260414_172922.down,
    name: '20260414_172922'
  },
];
