import Event, {STATES as EVENT_STATES} from "./index.js";
import Job from "../Job/index.js";

describe('Event Model', () => {
    const event = new Event(new Job('', { millisecond: 0, recurrent: false }, () => {}));

    it('should have a job', () => {
        expect(event.getJob()).toBeInstanceOf(Job);
    });

    it('should have an ID', () => {
        expect(event.getId()).not.toBeFalsy();
    });

    it('should have a state', () => {
        expect(event.getState()).toBe(EVENT_STATES.PENDING);
    });

    it('should have a success state after Job ran', (done) => {
        const event = new Event(new Job('', { millisecond: 0, recurrent: false }, () => {}));
        event.getJob()
            .run()
            .then(() => {
                expect(event.getState()).toBe(EVENT_STATES.SUCCESS);
                done();
            });
    }, 20);

    it('should save failed state after Job failed', (done) => {
        const event = new Event(new Job('', { millisecond: 0, recurrent: false }, () => {
            throw new Error(`Error`);
        }));

        event.getJob()
            .run()
            .catch(e => {
                expect(event.getState()).toBe(EVENT_STATES.FAILED);
                done();
            });
    }, 20);
});