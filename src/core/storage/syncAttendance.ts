import NetInfo from '@react-native-community/netinfo';

import {getAttendanceLogs} from './getAttendanceLogs';

import {markAttendanceAsSynced} from './markAttendanceAsSynced';

export async function syncAttendance() {
  try {
    /*
      CHECK INTERNET
    */
    console.log('STARTING SYNC...');
    const state = await NetInfo.fetch();

    if (!state.isConnected) {
      console.log('NO INTERNET CONNECTION');

      return;
    }

    /*
      FETCH PENDING LOGS
    */

    const pendingLogs = await getAttendanceLogs();

    console.log('PENDING LOGS:', pendingLogs.length);

    /*
      PROCESS QUEUE
    */

    for (const log of pendingLogs) {
      try {
        /*
          TEMP AWS SIMULATION
        */

        console.log('SYNCING LOG:', log.id);

        await new Promise(resolve => setTimeout(resolve, 500));

        /*
          MARK SYNCED
        */

        await markAttendanceAsSynced(log.id);
      } catch (error) {
        console.log('SYNC FAILED:', log.id);
      }
    }

    console.log('SYNC COMPLETE');
  } catch (error) {
    console.log('SYNC ERROR:', error);
  }
}
