import Job, { STATES } from './Job/index.js';
import Event from './Event/index.js';

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

        const job = new Job(type, schedule, callback);
        this.scheduleJob(job);
    },

    scheduleJob(job) {
        const schedule = job.getSchedule();
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
        // if queue is full stash job for later on the engine event queue
        if (this.jobQueue.length > MAX_QUEUE_SIZE) {
            setTimeout(() => {
                this.addJobToQueue(job);
            }, 0)
        }

        this.jobQueue.push(job);
    },

    run() {
        this.mainTimerId = setInterval(this.runJobsFromQeue.bind(this), TICK_TIME);
    },

    stop() {
        clearInterval(this.mainTimerId);

        // clear all job scheduling
        this.totalJobs.forEach(jobData => {
            if(jobData.recurrent) {
                clearInterval(jobData.timerId);
            } else {
                clearTimeout(jobData.timerId);
            }
        });
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
        Promise.all(jobs.map(job => job.run()))
    },

    getStats() {
        const runningJobs = this.totalJobs.filter(({job}) => {
            return job.getState() == STATES.RUNNING;
        })

        return {
            totalJobs: this.totalJobs.length,
            queueSize: this.jobQueue.length,
            runningJobs: runningJobs.length
        };
    },

    clear() {
        this.stop();
        this.totalJobs = [];
        this.jobQueue = [];
    }
};