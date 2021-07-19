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
        this.schedule = schedule || '*****';
        this.callback = callback;
        this.setState(STATES.PENDING);
    }

    getType() {
        return this.type;
    }

    getSchedule() {
        return this.schedule;
    }

    setState(state) {
        this.state = state;
        return this;
    }

    getState() {
        return this.state;
    }

    async run() {
        return Promise
            .resolve()
            .then(async () => {
            this.setState(STATES.RUNNING);
            try {
                const res = await this.callback();
                this.setState(STATES.PENDING);
                return res;
            } catch (error) {
                this.setState(STATES.FAILED);
                throw error;
            }
        });
    }
}