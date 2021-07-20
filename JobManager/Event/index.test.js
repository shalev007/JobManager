import Event from "./index.js";
import Job from "../Job/index.js";

describe('Event Model', () => {
    const event = new Event(new Job('', { millisecond: 0, recurrent: false }, () => {}));

    it('should have a job', () => {
        expect(event.getJob()).toBeInstanceOf(Job);
    });

    it('should have an ID', () => {
        expect(event.getId()).not.toBeFalsy();
    });

    it.todo('should have a state');
    it.todo('should save ran successfuly state after Job ran');
    it.todo('should save failed state after Job failed');
});