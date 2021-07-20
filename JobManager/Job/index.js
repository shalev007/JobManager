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
        this.state = STATES.PENDING;

        // store new job object
        const { _id } = JobStore.insert(
            this.type,
            this.schedule,
            this.callback,
            this.state
        );

        this.id = _id;

        // lifecycle additional functions
        this.afterAction = null;
        this.failedAction = null;
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

    setAfterRun(callback) {
        this.afterAction = callback;
    }

    setAfterFailed(callback) {
        this.failedAction = callback;
    }

    async afterRun(response) {
        this.afterAction && this.afterAction(response);
    }

    async afterFailed(error) {
        this.failedAction && this.failedAction(error);
    }

    clearLifecycleActions() {
        this.afterAction = null;
        this.failedAction = null;
    }

    async run() {
        this.setState(STATES.RUNNING);
        try {
            const res = await this.callback();
            this.setState(STATES.PENDING);
            await this.afterRun(res);
            return res;
        } catch (error) {
            this.setState(STATES.FAILED);
            await this.afterFailed(error);
            throw error;
        }
    }
}