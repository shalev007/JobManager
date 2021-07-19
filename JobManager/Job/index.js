import JobStore from '../../Store/Job/index.js';

export const STATES = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    FAILED: 'FAILED',
};

export default class Job {
    constructor(type, schedule, callback) {
        if(!callback) {
            throw new Error('Missing function on creating new Job');
        }

        this.type = type || 'General';
        this.schedule = schedule;
        this.callback = callback;
        this.setState(STATES.PENDING);

        // store new job object
        const { _id } = JobStore.insert(
            this.type,
            this.schedule,
            this.callback,
            this.state
        );

        this.id = _id;
    }

    getId() {
        return this.id;
    }

    getSchedule() {
        return this.schedule;
    }

    getType() {
        return this.type;
    }

    setState(state) {
        this.state = state;
        // update store state
        JobStore.update(this.id, { state });

        return this;
    }

    getState() {
        return this.state;
    }

    async run() {
        this.setState(STATES.RUNNING);
        try {
            const res = await this.callback();
            this.setState(STATES.PENDING);
            return res;
        } catch (error) {
            this.setState(STATES.FAILED);
            throw error;
        }
    }
}