import Job from './Job/index.js';

export const TICK_TIME = 1000;
export const MAX_RUNNING_JOBS = 5;
export const MAX_QUEUE_SIZE = 500;

// cached singleton
export default {
    totalJobs: [],
    jobQueue: [],
    mainTimerId: null,

    registerJob(type = '', schedule = {}, callback = () => {}) {
        // set schedule defaults
        schedule.millisecond = schedule.millisecond || 0;
        schedule.recurrent = schedule.recurrent ?? false;

        const job = new Job(type, callback);
        this.scheduleJob(job, schedule);
    },

    scheduleJob(job, schedule) {
        let timerId;
        if (schedule.recurrent) {// schedule recurrent job
            timerId = setInterval(() => {
                this.addJobToQueue(job);
            }, schedule.millisecond);

        } else { // schedule one time job
            timerId = setTimeout(() => {
                this.addJobToQueue(job);
            }, schedule.millisecond);
        }

        this.totalJobs.push({job, schedule, timerId});
    },

    addJobToQueue(job) {
        if (this.jobQueue.length <= MAX_QUEUE_SIZE) {
            this.jobQueue.push(job);
        }
    },

    run() {
        this.mainTimerId = setInterval(this.runJobsFromQeue.bind(this), TICK_TIME);
    },

    stop() {
        clearInterval(this.mainTimerId);
    },

    getJobsFromQueue() {
        // don't run if queue is empty
        if(!this.jobQueue.length) {
            return [];
        }

        const jobs = [];

        // limit current running jobs to max of 5
        let i = Math.min(MAX_RUNNING_JOBS, this.jobQueue.length);
        while(i--) {
            jobs.push(this.jobQueue.shift());
        }

        return jobs;
    },
    
    async runJobsFromQeue() {
        const jobs = this.getJobsFromQueue();
        if(!jobs.length) {
            return;
        }

        // run jobs async
        await Promise.all(jobs.map(job => job.run()))
    },

    printStats() {
        console.log(JSON.stringify({
            totalJobs: this.totalJobs.length,
            queueSize: this.jobQueue.length
        }, null, 2))
    },

    clear() {
        this.stop();
        this.totalJobs.forEach(jobData => {
            if(jobData.recurrent) {
                clearInterval(jobData.timerId);
            } else {
                clearTimeout(jobData.timerId);
            }
        });

        this.totalJobs = [];
        this.jobQueue = [];
    }
};