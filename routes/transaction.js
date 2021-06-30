
import Transaction from '~/database/models/transaction';
import messageConstants from '~/constants/message';

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return res.status(200).send(transactions);
  } catch (error) {
    console.log('[routes TransactionAPI getTransactions] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.getTransactionsByAccount = async (req, res) => {
  try {
    const { account } = req.params;
    const transactions = await Transaction.find({
      $or: [
        { sender: account },
        { toReceiver: account },
      ]
    }).sort({ createdAt: -1 });
    return res.status(200).send(transactions);
  } catch (error) {
    console.log('[routes TransactionAPI getTransactionsByAccount] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.searchTransactions = async (req, res) => {
  try {
    const {
      query = '',
      fromChain = '',
      toChain = '',
      state = ''
    } = req.body;

    let match = {};
    if (query) {
      match = {
        $or: [
          { sender: { $regex: new RegExp('.*' + query.toLowerCase() + '.*', 'i') } },
          { toReceiver: { $regex: new RegExp('.*' + query.toLowerCase() + '.*', 'i') } },
          { fromHash: { $regex: new RegExp('.*' + query.toLowerCase() + '.*', 'i') } },
          { toHash: { $regex: new RegExp('.*' + query.toLowerCase() + '.*', 'i') } },
        ]
      }
    }

    if (fromChain) {
      match = {
        ...match,
        fromChain,
      }
    }

    if (toChain) {
      match = {
        ...match,
        toChain,
      }
    }

    if (state) {
      match = {
        ...match,
        state,
      }
    }

    const transactions = await Transaction.find(match).sort({ createdAt: -1 });
    return res.status(200).send(transactions);
  } catch (error) {
    console.log('[routes TransactionAPI searchTransactions] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { _id } = req.params;
    const transaction = await Transaction.findById(_id);
    return res.status(200).send(transaction);
  } catch (error) {
    console.log('[routes TransactionAPI getTransaction] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    let transaction = req.body;
    transaction = await Transaction.create(transaction);
    return res.status(200).send(transaction);
  } catch (error) {
    console.log('[routes TransactionAPI addTransaction] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    let transaction = req.body;
    transaction = await Transaction.findOneAndUpdate({ _id: transaction._id }, { $set: transaction }, { new: true });
    return res.status(200).send(transaction);
  } catch (error) {
    console.log('[routes TransactionAPI editTransaction] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};

exports.removeTransaction = async (req, res) => {
  try {
    const _id = req.query._id;
    const transaction = await Transaction.findOneAndDelete({ _id });
    return res.status(200).send(transaction);
  } catch (error) {
    console.log('[routes TransactionAPI removeTransaction] error => ', error);
    return res.status(500).json({
      message: messageConstants.SOMETHING_WENT_WRONG
    });
  }
};