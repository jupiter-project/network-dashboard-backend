
import cron from 'node-cron'

import { CRON_SCHEDULE_JUPITER } from '~/constants/common'
import Dashboard from '~/database/models/dashboard';
import * as jupiterAPI from '~/services/api-jupiter'
import { isEmpty } from '~/utils/utility'
import { getTimestamp } from '~/utils/getTimestamp'

const createCronJob = () => {
  return cron.schedule(CRON_SCHEDULE_JUPITER, async () => {
    try {
      let dashboard = await Dashboard.findOne();
      if (!isEmpty(dashboard)) {
        const blockchainStatus = await jupiterAPI.getBlockchainStatus();

        const currentHeight = blockchainStatus.numberOfBlocks;
        const blockGenerationTime = getTimestamp(new Date()) / currentHeight;

        let totalTxs = dashboard.currentHeight * dashboard.txsPerBlock;
        let totalFees = dashboard.currentHeight * dashboard.feePerBlock;
        let newBlocks = currentHeight - dashboard.currentHeight;

        const params = {
          firstIndex: 0,
          lastIndex: newBlocks
        }
        const { blocks = [] } = await jupiterAPI.getBlocks(params);

        for (const block of blocks) {
          totalTxs += block.numberOfTransactions;
          totalFees += parseInt(block.totalFeeNQT, 10);
        }

        const txsPerBlock = totalTxs / currentHeight;
        const feePerBlock = totalFees / currentHeight;

        dashboard.currentHeight = currentHeight
        dashboard.blockGenerationTime = blockGenerationTime
        dashboard.txsPerBlock = txsPerBlock
        dashboard.feePerBlock = feePerBlock

        dashboard = await dashboard.save();
      }
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