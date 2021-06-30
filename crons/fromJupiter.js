
import cron from 'node-cron'

import { CRON_SCHEDULE_JUPITER } from '~/constants/common'
import * as jupiterAPI from '~/services/api-jupiter'

const createCronJob = () => {
  return cron.schedule(CRON_SCHEDULE_JUPITER, async () => {
    try {
    } catch (error) {
      console.log('[ERROR]:cron-job fromJupiter', error);
    }
  });
}

const startFromJupiterCronJob = () => {
  const cronJob = createCronJob();
  cronJob.start();
};

export default startFromJupiterCronJob;