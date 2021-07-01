
import cron from 'node-cron'

import { CRON_SCHEDULE_JUPITER } from '~/constants/common'
import Dashboard from '~/database/models/dashboard';
import * as jupiterAPI from '~/services/api-jupiter'
import { isEmpty } from '~/utils/utility'

const BLOCK_NUMBER = 3456
const createCronJob = () => {
  return cron.schedule(CRON_SCHEDULE_JUPITER, async () => {
    try {
      const blockchainStatus = await jupiterAPI.getBlockchainStatus();

      let totalBlocks = []
      for (let i = 0; i < BLOCK_NUMBER; i += 1000) {
        const params = {
          firstIndex: i,
          lastIndex: i + 1000 < BLOCK_NUMBER ? i + 1000 : BLOCK_NUMBER - 1
        }
        const { blocks = [] } = await jupiterAPI.getBlocks(params);

        totalBlocks = [
          ...totalBlocks,
          ...blocks
        ]
      }

      let totalTxs = 0;
      let totalFees = 0;
      for (const block of totalBlocks) {
        totalTxs += block.numberOfTransactions;
        totalFees += parseInt(block.totalFeeNQT, 10);
      }

      const currentHeight = blockchainStatus.numberOfBlocks;
      const blockGenerationTime = (totalBlocks[0].timestamp - totalBlocks[BLOCK_NUMBER - 1].timestamp) / BLOCK_NUMBER;
      const txsPerBlock = totalTxs / BLOCK_NUMBER;
      const feePerBlock = totalFees / BLOCK_NUMBER;

      let dashboard = await Dashboard.findOne();
      if (isEmpty(dashboard)) {
        dashboard = {
          currentHeight,
          blockGenerationTime,
          txsPerBlock,
          feePerBlock
        }
        await Dashboard.create(dashboard);
        return;
      }

      dashboard.currentHeight = currentHeight
      dashboard.blockGenerationTime = blockGenerationTime
      dashboard.txsPerBlock = txsPerBlock
      dashboard.feePerBlock = feePerBlock
      await dashboard.save();
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