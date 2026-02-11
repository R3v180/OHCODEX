import * as migration_20260211_092117 from './20260211_092117';

export const migrations = [
  {
    up: migration_20260211_092117.up,
    down: migration_20260211_092117.down,
    name: '20260211_092117'
  },
];
