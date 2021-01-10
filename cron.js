const CronJob = require('cron').CronJob;
const Cron = require('./backup.js');

// AutoBackUp every week (at 00:00 on Sunday)
new CronJob(
  '0 0 * * SUN',
  function () {
    Cron.dbAutoBackUp();
    console.log('Data backed up');
  },
  null,
  true,
  'America/New_York'
);
