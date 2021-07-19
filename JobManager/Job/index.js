import {v1 as uuidv1} from 'uuid';

export const STATES = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    FAILED: 'FAILED',
};

export default class Job {
    constructor(type, callback) {
        if(!callback) {
            throw new Error('Missing function on creating new Job');
        }

        this.id = uuidv1();
        this.type = type || 'General';
        this.callback = callback;
        this.setState(STATES.PENDING);
    }

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    setState(state) {
        this.state = state;
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