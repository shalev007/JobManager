import Job, {STATES as JOB_STATES} from './index.js';

const JOB_TYPE = 'usage-report';
const JOB_VALUE = 'return value';

describe('Job Model', () => {
    const job = new Job(
        JOB_TYPE,
        {millisecond: 0, recurrent: false},
        async () => {
            return JOB_VALUE;
        }
    );
    
    it('should have an ID', () => {
        expect(job.getId()).not.toBeFalsy();
    });

    it(`should be type ${JOB_TYPE}`, () => {
        expect(job.getType()).toBe(JOB_TYPE);
    });

    it('should have a schdule', () => {
        expect(job.getSchedule()).toEqual(
            expect.objectContaining({
            millisecond: 0,
            recurrent: false
        }));
    });

    it('state should be pending', () => {
        expect(job.getState()).toBe(JOB_STATES.PENDING);
    });

    it('should be runnable', () => {
        expect(typeof job.callback).toBe('function');
    });

    it('throw an error if no callback is given', () => {
        expect(() => {
            new Job();
        }).toThrowError();
    });

    it('should be on status running during run', (done) => {
        const job = new Job('', {millisecond: 0, recurrent: false}, () => {
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
        const job = new Job('', {millisecond: 0, recurrent: false}, () => {
            throw new Error();
        });

        job
        .run()
        .catch(e => {
            expect(job.getState()).toBe(JOB_STATES.FAILED);
            done();
        })
    }, 20);

    it('should run an after run function', (done) => {
        const value = 1;
        const job = new Job('', {millisecond: 0, recurrent: false}, () => value);
        job.setAfterRun(returnedValue => {
            expect(returnedValue).toBe(value);
            done();
        });

        job.run();
    }, 20);

    it('should run a failed run function', (done) => {
        const job = new Job('', {millisecond: 0, recurrent: false}, () => {
            throw new Error();
        });

        job.setAfterFailed(error => {
            expect(error).toBeInstanceOf(Error);
            done();
        });

        job.run().catch(e => {});
    }, 20);
});