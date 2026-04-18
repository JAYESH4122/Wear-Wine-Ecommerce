import * as migration_20260414_120000 from './20260414_120000';
import * as migration_20260414_172922 from './20260414_172922';
import * as migration_20260417_162541 from './20260417_162541';

export const migrations = [
  {
    up: migration_20260414_120000.up,
    down: migration_20260414_120000.down,
    name: '20260414_120000',
  },
  {
    up: migration_20260414_172922.up,
    down: migration_20260414_172922.down,
    name: '20260414_172922',
  },
  {
    up: migration_20260417_162541.up,
    down: migration_20260417_162541.down,
    name: '20260417_162541'
  },
];
