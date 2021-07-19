import Job, {STATES as JOB_STATES} from './index.js';

const JOB_TYPE = 'usage-report';
const JOB_SCHEDULE = '* * * *';
const JOB_VALUE = 'return value';

describe('Job', () => {
    const job = new Job(
        JOB_TYPE,
        JOB_SCHEDULE,
        async () => {
            console.log('Hello from test job');
            return JOB_VALUE;
        }
    );

    it(`type should be ${JOB_TYPE}`, () => {
        expect(job.getType()).toBe(JOB_TYPE);
    });

    it('state should be pending', () => {
        expect(job.getState()).toBe(JOB_STATES.PENDING);
    });

    it('should have a schedule', () => {
        expect(job.getSchedule()).toBe(JOB_SCHEDULE);
    });

    it('should be runnable', () => {
        expect(typeof job.callback).toBe('function');
    });

    it('should be on status running during run', (done) => {
        const job = new Job('', '', () => {
            expect(job.getState()).toBe(JOB_STATES.RUNNING);
            done();
        });

        job.run()
    });

    it('should be on status pending after run', (done) => {
        job
        .run()
        .then(() => {
            expect(job.getState()).toBe(JOB_STATES.PENDING)
            done();
        });
    });

    it('should return value of the callback after promise end', (done) => {
        job
        .run()
        .then(value => {
            expect(value).toBe(JOB_VALUE);
            done();
        })
    });

    it('should have failed status when throwing an error', (done) => {
        const job = new Job('', '', () => {
            throw new Error('This is test error');
        });

        job
        .run()
        .catch(e => {
            expect(job.getState()).toBe(JOB_STATES.FAILED);
            done();
        })
    }, 200);
});