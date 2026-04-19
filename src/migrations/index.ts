import * as migration_20260418_145114 from './20260418_145114';
import * as migration_20260419_163606 from './20260419_163606';
import * as migration_20260419_172138_add_razorpay_payment_id_index from './20260419_172138_add_razorpay_payment_id_index';

export const migrations = [
  {
    up: migration_20260418_145114.up,
    down: migration_20260418_145114.down,
    name: '20260418_145114',
  },
  {
    up: migration_20260419_163606.up,
    down: migration_20260419_163606.down,
    name: '20260419_163606',
  },
  {
    up: migration_20260419_172138_add_razorpay_payment_id_index.up,
    down: migration_20260419_172138_add_razorpay_payment_id_index.down,
    name: '20260419_172138_add_razorpay_payment_id_index'
  },
];
