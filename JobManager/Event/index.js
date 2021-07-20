import EventStore from '../../Store/Event/index.js';

export const STATES = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
}

export default class Event {
    constructor(job) {
        this.job = job;
        this.state = STATES.PENDING;
        const { _id } = EventStore.insert(job, this.state);
        this.id = _id;
        this.addJobLifecycleMethods();
    }

    getId() {
        return this.id;
    }

    getJob() {
        return this.job;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
        // update store state
        EventStore.update(this.id, { state });

        return this;
    }

    addJobLifecycleMethods() {
        const job = this.getJob();

        job.setAfterRun(value => {
            this.setState(STATES.SUCCESS);
            job.clearLifecycleActions();

            // save the returned value
            EventStore.update(this.id, { value });
        });

        job.setAfterFailed(error => {
            this.setState(STATES.FAILED);
            job.clearLifecycleActions();

            // save the error
            EventStore.update(this.id, { value: error.message });
        });
    }
};