import Job, {STATES as JOB_STATES} from './index.js';

const JOB_TYPE = 'usage-report';
const JOB_VALUE = 'return value';

describe('Job', () => {
    const job = new Job(
        JOB_TYPE,
        async () => {
            return JOB_VALUE;
        }
    );
    
    it(`type should have an ID`, () => {
        expect(job.getId()).not.toBeFalsy();
    });

    it(`type should be ${JOB_TYPE}`, () => {
        expect(job.getType()).toBe(JOB_TYPE);
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
        const job = new Job('', () => {
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
        const job = new Job('', () => {
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