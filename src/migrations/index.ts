import * as migration_20260411_092801 from './20260411_092801';

export const migrations = [
  {
    up: migration_20260411_092801.up,
    down: migration_20260411_092801.down,
    name: '20260411_092801'
  },
];
