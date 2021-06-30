
import mongoose from 'mongoose';

import timestampPlugin from '~/database/models/plugins/timestamp';

const DashboardSchema = new mongoose.Schema({
  currentHeight: {
    type: Number,
    default: 0
  },
  txsPerBlock: {
    type: Number,
    default: 0
  },
  feePerBlock: {
    type: Number,
    default: 0
  },
  blockGenerationTime: {
    type: Number,
    default: 0
  },
});

DashboardSchema.plugin(timestampPlugin);
const Dashboard = mongoose.model('dashboard', DashboardSchema);
export default Dashboard;