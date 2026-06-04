import {saveAttendance} from '../storage/saveAttendance';
import {getCurrentLocation} from '../location/getCurrentLocation';
import {syncAttendance} from '../storage/syncAttendance';
export async function markAttendance({
  userId,
  similarity,
}: {
  userId: string;
  similarity: number;
}) {
  try {
    /* GET LOCATION */ const location = await getCurrentLocation();
    /* SAVE ATTENDANCE */ await saveAttendance({
      userId,
      similarity,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log('ATTENDANCE MARKED');
    await syncAttendance();
  } catch (error) {
    /* FALLBACK WITHOUT GPS */ console.log(
      'LOCATION FAILED, SAVING WITHOUT GPS',
    );
    await saveAttendance({userId, similarity, latitude: null, longitude: null});
  }
}
