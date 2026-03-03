import * as migration_20260211_092117 from './20260211_092117';
import * as migration_20260303_161202_ads_settings_global from './20260303_161202_ads_settings_global';

export const migrations = [
  {
    up: migration_20260211_092117.up,
    down: migration_20260211_092117.down,
    name: '20260211_092117',
  },
  {
    up: migration_20260303_161202_ads_settings_global.up,
    down: migration_20260303_161202_ads_settings_global.down,
    name: '20260303_161202_ads_settings_global'
  },
];
