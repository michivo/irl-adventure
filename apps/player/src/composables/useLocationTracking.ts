import { ref } from 'vue';
import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { useNyanCatPlayer } from './useNyanCatPlayer';
import { toErrorMessage, useLogger } from './useLogger';

const NYAN_CAT_LATITUDE_TRIGGER = 47.033;
let locationCount = 0;

export function useLocationTracking() {
  const isTracking = ref(false);
  const { logInfo, logError } = useLogger('locationTracker');
  const { play } = useNyanCatPlayer();

  async function start(): Promise<void> {
    try {
      await BackgroundGeolocation.start(
        {
          backgroundMessage: 'App is using your location in the background',
          backgroundTitle: 'Location Service',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (location, error) => {
          if (error) {
            logError(`Location error: ${toErrorMessage(error)}`);
            return;
          }
          if (location) {
            locationCount++;
            logInfo(`New location (#${locationCount}): ${location.latitude}, ${location.longitude}`);
            if (location.latitude < NYAN_CAT_LATITUDE_TRIGGER || locationCount % 10 === 0) {
              play();
            }
          }
        },
      );
      isTracking.value = true;
    } catch (error) {
      logError(`Failed to start location tracking: ${toErrorMessage(error)}`);
    }
  }

  async function stop(): Promise<void> {
    try {
      await BackgroundGeolocation.stop();
    } catch (error) {
      logError(`Failed to stop location tracking: ${toErrorMessage(error)}`);
    } finally {
      isTracking.value = false;
    }
  }

  async function toggle(): Promise<void> {
    if (isTracking.value) {
      await stop();
    } else {
      await start();
    }
  }

  return { isTracking, start, stop, toggle };
}
