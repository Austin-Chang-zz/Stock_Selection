import * as cron from 'node-cron';
import { dataSyncService } from './dataSync';

export class SchedulerService {
  private dailySyncJob: ReturnType<typeof cron.schedule> | null = null;

  startDailySync(): void {
    this.dailySyncJob = cron.schedule('30 14 * * 1-5', async () => {
      const today = new Date().toISOString().split('T')[0];
      console.log(`[Scheduler] Running daily sync for ${today}`);
      
      try {
        await dataSyncService.fullSync(today);
        console.log(`[Scheduler] Daily sync completed successfully`);
      } catch (error) {
        console.error(`[Scheduler] Daily sync failed:`, error);
      }
    }, {
      timezone: "Asia/Taipei"
    });

    console.log('[Scheduler] Daily sync job started (14:30 Taiwan time, Mon-Fri)');
  }

  stopDailySync(): void {
    if (this.dailySyncJob) {
      this.dailySyncJob.stop();
      this.dailySyncJob = null;
      console.log('[Scheduler] Daily sync job stopped');
    }
  }

  async runManualSync(date?: string): Promise<void> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    console.log(`[Scheduler] Running manual sync for ${targetDate}`);
    
    try {
      await dataSyncService.fullSync(targetDate);
      console.log(`[Scheduler] Manual sync completed successfully`);
    } catch (error) {
      console.error(`[Scheduler] Manual sync failed:`, error);
      throw error;
    }
  }
}

export const scheduler = new SchedulerService();
