import * as migration_20260311_173939 from './20260311_173939';
import * as migration_20260314_191149 from './20260314_191149';

export const migrations = [
  {
    up: migration_20260311_173939.up,
    down: migration_20260311_173939.down,
    name: '20260311_173939',
  },
  {
    up: migration_20260314_191149.up,
    down: migration_20260314_191149.down,
    name: '20260314_191149'
  },
];
