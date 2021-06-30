
import Dashboard from '~/database/models/dashboard';
import messageConstants from '~/constants/message';
import * as jupiterAPI from '~/services/api-jupiter'
import { isEmpty } from '~/utils/utility'
import { getTimestamp } from '~/utils/getTimestamp'

exports.initDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    if (!isEmpty(dashboard)) {
      return res.status(500).json({
        message: messageConstants.INIT_DASHBOARD_ERROR
      });
    }

    const blockchainStatus = await jupiterAPI.getBlockchainStatus();
    const currentHeight = blockchainStatus.numberOfBlocks;
    const blockGenerationTime = getTimestamp(new Date()) / currentHeight;

    let totalTxs = 0;
    let totalFees = 0;
    let totalBlocks = 0;
    for (let i = 0; i < currentHeight; i += 1000) {
      const params = { firstIndex: i, lastIndex: i + 1000 }
      const { blocks = [] } = await jupiterAPI.getBlocks(params);

      totalBlocks += blocks.length
      for (const block of blocks) {
        totalTxs += block.numberOfTransactions;
        totalFees += parseInt(block.totalFeeNQT, 10);
      }
      console.log('totalBlocks => ', totalBlocks);
    }

    const txsPerBlock = totalTxs / totalBlocks;
    const feePerBlock = totalFees / totalBlocks;

    dashboard = {
      currentHeight,
      blockGenerationTime,
      txsPerBlock,
      feePerBlock
    }

    dashboard = await Dashboard.create(dashboard);
    return res.status(200).send(dashboard);
  } catch (error) {
    console.log('[routes DashboardAPI initDashboard] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne();
    return res.status(200).send(dashboard);
  } catch (error) {
    console.log('[routes DashboardAPI getDashboard] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};
