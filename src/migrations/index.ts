import * as migration_20260410_172428 from './20260410_172428';
import * as migration_20260411_074200 from './20260411_074200';

export const migrations = [
  {
    up: migration_20260410_172428.up,
    down: migration_20260410_172428.down,
    name: '20260410_172428',
  },
  {
    up: migration_20260411_074200.up,
    down: migration_20260411_074200.down,
    name: '20260411_074200'
  },
];
