
import DashboardAPI from '~/routes/dashboard';

exports.assignRoutes = app => {

  // * dashboard API
  app.get('/api/init-dashboard', DashboardAPI.initDashboard);
  app.get('/api/dashboard', DashboardAPI.getDashboard);
}

