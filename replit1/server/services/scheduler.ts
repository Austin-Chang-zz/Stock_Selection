import * as cron from 'node-cron';
import { dataSyncService } from './dataSync';

/**
 * SchedulerService - Handles automated and manual data synchronization scheduling
 * Uses node-cron for scheduling daily syncs at 14:30 Taiwan time on weekdays
 */
export class SchedulerService {
  private dailySyncJob: ReturnType<typeof cron.schedule> | null = null;

  /**
   * Starts the daily automatic synchronization job
   * Runs Monday-Friday at 14:30 Taiwan time (2:30 PM)
   */
  startDailySync(): void {
    // cron syntax: '30 14 * * 1-5' means:
    // - 30th minute (30)
    // - 14th hour (2 PM)
    // - Any day of month (*)
    // - Any month (*)
    // - Monday-Friday (1-5)
    this.dailySyncJob = cron.schedule('30 14 * * 1-5', async () => {
      const today = new Date().toISOString().split('T')[0];
      console.log(`[Scheduler] Running daily sync for ${today}`);

      try {
        // Execute full synchronization process
        await dataSyncService.fullSync(today);
        console.log(`[Scheduler] Daily sync completed successfully`);
      } catch (error) {
        console.error(`[Scheduler] Daily sync failed:`, error);
      }
    }, {
      timezone: "Asia/Taipei" // Important: Set correct timezone for Taiwan stock market
    });

    console.log('[Scheduler] Daily sync job started (14:30 Taiwan time, Mon-Fri)');
  }

  /**
   * Stops the daily synchronization job
   * Useful for cleanup during application shutdown
   */
  stopDailySync(): void {
    if (this.dailySyncJob) {
      this.dailySyncJob.stop();
      this.dailySyncJob = null;
      console.log('[Scheduler] Daily sync job stopped');
    }
  }

  /**
   * Manually triggers data synchronization for a specific date
   * @param date - Optional date string in YYYY-MM-DD format, uses today if not provided
   */
  async runManualSync(date?: string): Promise<void> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    console.log(`[Scheduler] Running manual sync for ${targetDate}`);

    try {
      await dataSyncService.fullSync(targetDate);
      console.log(`[Scheduler] Manual sync completed successfully`);
    } catch (error) {
      console.error(`[Scheduler] Manual sync failed:`, error);
      throw error; // Re-throw to let caller handle the error
    }
  }
}

// Export singleton instance for use throughout the application
export const scheduler = new SchedulerService();