import JobManager, { MAX_RUNNING_JOBS } from '../JobManager/index.js';
import { STATES } from '../JobManager/Job/index.js';

const JOB_TYPE = 'usage-report';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('JobManager', () => {

    afterEach(() => {
        JobManager.clear();
    });

    it('should add new job to total jobs', () => {
        JobManager.registerJob(JOB_TYPE, { millisecond: 0, recurrent: false }, () => {});
        expect(JobManager.totalJobs.length).toBe(1);
    });

    it('should add job to queue', (done) => {
        JobManager.registerJob(JOB_TYPE, { millisecond: 0, recurrent: false }, () => {});
        setTimeout(() => {
            expect(JobManager.eventQueue.length).toBe(1);
            done();
        }, 0)
    }, 20);

    it(`should pop ${MAX_RUNNING_JOBS} job from queue`, (done) => {
        const additionalJobs = 1;
        let i = MAX_RUNNING_JOBS + additionalJobs;
        while(i--) {
            JobManager.registerJob(JOB_TYPE, { millisecond: 0, recurrent: false }, () => {});
        }

        setTimeout(() => {
            // jobs popped
            const jobs = JobManager.getEventsFromQueue();
            expect(jobs.length).toBe(MAX_RUNNING_JOBS);
            // jobs remained in queue
            expect(JobManager.eventQueue.length).toBe(additionalJobs);
            done();
        }, 10)
    }, 20);

    it('should run jobs concurrently', (done) => {
        // slow
        JobManager.registerJob(JOB_TYPE, { millisecond: 0, recurrent: false }, async () => {
            await wait(200);
        });

        // fast
        JobManager.registerJob(JOB_TYPE, { millisecond: 0, recurrent: false }, () => {
            // both jobs should be on running state togather
            JobManager.totalJobs.forEach(jobData => {
                expect(jobData.job.getState()).toBe(STATES.RUNNING);
            });
            done();
        });

        setTimeout(() => {
            JobManager.runJobsFromQeue();
        }, 0);
    }, 500);

    it('should inspect current statistics', () => {
        expect(JobManager.inspect()).toEqual(
            expect.objectContaining({
                totalJobs: 0,
                queueSize: 0,
                runningJobs: 0,
            })
        );
    });

    it('should stop running jobs and clear queue', (done) => {
        JobManager.registerJob(JOB_TYPE, { millisecond: 100, recurrent: true }, () => {});
        JobManager.run();

        setTimeout(() => {
            JobManager.clear();
            expect(JobManager.eventQueue.length).toBe(0);
            done();
        }, 200);
    }, 300)
})