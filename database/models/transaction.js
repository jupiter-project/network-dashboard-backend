
import mongoose from 'mongoose';

import timestampPlugin from '~/database/models/plugins/timestamp';

const TransactionSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  toReceiver: {
    type: String,
    required: true
  },
  fromHash: {
    type: String,
    default: null
  },
  toHash: {
    type: String,
    default: null
  },
});

TransactionSchema.plugin(timestampPlugin);
const Transaction = mongoose.model('transaction', TransactionSchema);
export default Transaction;