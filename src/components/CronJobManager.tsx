import { useState } from 'react';
import * as Sentry from "@sentry/nextjs";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  shouldFail: boolean;
  failureType: 'error' | 'timeout' | 'memory' | 'none';
  lastRun?: Date;
  status: 'idle' | 'running' | 'success' | 'failed';
}

const PRESET_JOBS = [
  { name: 'Daily Cleanup', schedule: '0 0 * * *' },
  { name: 'Hourly Sync', schedule: '0 * * * *' },
  { name: '5min Health Check', schedule: '*/5 * * * *' },
];

export function CronJobManager() {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [newJobName, setNewJobName] = useState('');
  const [schedule, setSchedule] = useState('*/5 * * * *');

  const addCronJob = (name = newJobName, scheduleStr = schedule) => {
    if (!name) return;
    
    const newJob: CronJob = {
      id: Date.now().toString(),
      name,
      schedule: scheduleStr,
      shouldFail: false,
      failureType: 'none',
      status: 'idle'
    };

    setCronJobs([...cronJobs, newJob]);
    setNewJobName('');
  };

  const addPresetJob = (preset: typeof PRESET_JOBS[0]) => {
    addCronJob(preset.name, preset.schedule);
  };

  const setFailureType = (jobId: string, failureType: CronJob['failureType']) => {
    setCronJobs(jobs => 
      jobs.map(job => 
        job.id === jobId 
          ? { ...job, failureType, shouldFail: failureType !== 'none' }
          : job
      )
    );
  };

  const runJob = async (job: CronJob) => {
    setCronJobs(jobs =>
      jobs.map(j =>
        j.id === job.id
          ? { ...j, status: 'running' }
          : j
      )
    );

    const transaction = Sentry.startTransaction({
      name: `manual-cron-${job.name}`,
      op: 'cron.manual',
    });

    try {
      // Simulate job execution
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!job.shouldFail) {
            resolve(true);
            return;
          }

          switch (job.failureType) {
            case 'timeout':
              // Simulate a timeout error
              reject(new Error(`Cron job ${job.name} timed out after 30s`));
              break;
            case 'memory':
              // Simulate a memory error
              const error = new Error(`Cron job ${job.name} exceeded memory limit`);
              error.name = 'HeapOutOfMemory';
              reject(error);
              break;
            default:
              // Standard error
              reject(new Error(`Cron job ${job.name} failed (manually triggered failure)`));
          }
        }, 2000);
      });

      setCronJobs(jobs =>
        jobs.map(j =>
          j.id === job.id
            ? { ...j, status: 'success', lastRun: new Date() }
            : j
        )
      );
      
      transaction.setStatus('ok');
    } catch (error) {
      transaction.setStatus('error');
      Sentry.captureException(error);
      
      setCronJobs(jobs =>
        jobs.map(j =>
          j.id === job.id
            ? { ...j, status: 'failed', lastRun: new Date() }
            : j
        )
      );
    } finally {
      transaction.finish();
    }
  };

  return (
    <div className="cron-job-manager">
      <h3>Cron Job Manager</h3>
      
      <div className="preset-jobs">
        <h4>Quick Add Presets:</h4>
        <div className="preset-buttons">
          {PRESET_JOBS.map(preset => (
            <button
              key={preset.name}
              onClick={() => addPresetJob(preset)}
              className="preset-button"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="add-job-form">
        <input
          type="text"
          value={newJobName}
          onChange={(e) => setNewJobName(e.target.value)}
          placeholder="Job name"
        />
        <input
          type="text"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="Cron schedule"
        />
        <button onClick={() => addCronJob()}>Add Custom Job</button>
      </div>

      <div className="jobs-list">
        {cronJobs.map(job => (
          <div key={job.id} className={`job-item status-${job.status}`}>
            <div className="job-info">
              <h4>{job.name}</h4>
              <div className="job-schedule">{job.schedule}</div>
              <div className="job-status">Status: {job.status}</div>
              {job.lastRun && (
                <div className="job-last-run">
                  Last run: {job.lastRun.toLocaleString()}
                </div>
              )}
            </div>
            <div className="job-controls">
              <select
                value={job.failureType}
                onChange={(e) => setFailureType(job.id, e.target.value as CronJob['failureType'])}
                className="failure-type-select"
              >
                <option value="none">No Failure</option>
                <option value="error">Standard Error</option>
                <option value="timeout">Timeout Error</option>
                <option value="memory">Memory Error</option>
              </select>
              <button
                onClick={() => runJob(job)}
                disabled={job.status === 'running'}
                className={job.status === 'running' ? 'running' : ''}
              >
                {job.status === 'running' ? 'Running...' : 'Run Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 