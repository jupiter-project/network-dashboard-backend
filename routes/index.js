
import TransactionAPI from '~/routes/transaction';

exports.assignRoutes = app => {

  // * transaction API
  app.get('/api/transactions', TransactionAPI.getTransactions);
  app.get('/api/transactions/:_id', TransactionAPI.getTransactionById);
  app.post('/api/transactions', TransactionAPI.addTransaction);
}

