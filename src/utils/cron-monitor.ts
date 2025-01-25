import * as Sentry from "@sentry/nextjs";

export class CronMonitor {
  private transaction: Sentry.Transaction;
  private jobName: string;

  constructor(jobName: string) {
    this.jobName = jobName;
    this.transaction = Sentry.startTransaction({
      name: `cron-${jobName}`,
      op: 'cron',
    });
  }

  async execute<T>(job: () => Promise<T>): Promise<T> {
    const span = this.transaction.startChild({
      op: 'job.execute',
      description: this.jobName,
    });

    try {
      const result = await job();
      span.setStatus('ok');
      return result;
    } catch (error) {
      span.setStatus('error');
      Sentry.captureException(error, {
        tags: {
          job: this.jobName,
          type: 'cron',
        },
      });
      throw error;
    } finally {
      span.finish();
      this.transaction.finish();
    }
  }
} 