# JobManager

Basic job system that can schedule and execute jobs of different types.

Create different job definitions that run asynchronously.

## Installation

Clone and Install dependencies using npm

```bash
git clone https://github.com/shalev007/JobManager.git .
npm install
```

## Usage

```javascript
import JobManager from './JobManager/index.js';

// register a function with type and a schedule
JobManager.registerJob('send-notifications', { millisecond: 4000, recurrent: true }, () => {
    console.log(`send-notifications`);
});

// start running jobs
JobManager.run();

// you can add jobs after the jobs started running
JobManager.registerJob('usage-report', { millisecond: 2000, recurrent: true }, () => {
    console.log(`usage-report 1`);
});

// add a job to run immediately
JobManager.registerJob('run once', { millisecond: 0, recurrent: false }, () => {
    console.log(`You'll only see this line once`);
});

// inspect current statistics about the JobManager internals
JobManager.registerJob('show stats', { millisecond: 5000, recurrent: true }, () => {
    console.log(JobManager.inspect());
});

// stop the running jobs
JobManager.registerJob('Stop', { millisecond: 15000, recurrent: false }, () => {
    JobManager.stop();
    console.log(`Stopped Job manager`);
});

// clear all saved jobs and event queue
JobManager.registerJob('Clear', { millisecond: 0, recurrent: false }, () => {
    JobManager.clear();
    console.log(`Cleared Job manager`);
});
```
## Usage
Use [Jest.js](https://github.com/facebook/jest) to test

```bash
npm run test
```

## Authors
Shalev King Avhar
Me Demo 2

## License
[MIT](https://choosealicense.com/licenses/mit/)
