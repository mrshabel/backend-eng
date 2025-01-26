const http = require("node:http");
const url = require("node:url");

// store jobs to be processed
jobs = {};

const server = http.createServer((req, res) => {
    // extract the request url and method
    const { method } = req;
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    // send response as json
    res.writeHead(200, { "Content-Type": "application/json" });

    // route request to appropriate handler
    console.log(path, query);
    if (path === "/submit" && method === "POST") {
        submitJobHandler(res);
    } else if (path === "/check-status" && method === "GET") {
        if (!query.jobId) {
            res.end("\n\nNo jobId provided\n\n");
            return;
        }
        checkStatusHandler(res, query.jobId);
    } else {
        res.end("\n\nRoute not found\n\n");
    }
});

function submitJobHandler(res) {
    const jobId = `job:${Date.now()}`;
    jobs[jobId] = 0;

    // periodically update status of job in the background
    updateJob(jobId, 0);
    res.end(`\n\n${jobId}\n\n`);
}

async function checkStatusHandler(res, jobId) {
    const progress = jobs[jobId];
    if (!progress) {
        res.end("\n\nJob not found\n\n");
        return;
    }
    // keep task running in background until its complete
    while (!(await checkJobComplete(jobId))) {
        // essentially do nothing in while block
    }

    res.end(`\n\nJob Status: ${jobs[jobId]}%\n\n`);
}

function updateJob(jobId, progress) {
    jobs[jobId] = progress;

    console.log(`updating job with ID ${jobId} to ${progress}%`);

    // return when job is complete
    if (progress === 100) return;

    // update progress by 10 every 5 seconds
    setTimeout(() => updateJob(jobId, progress + 10), 5000);
}

async function checkJobComplete(jobId) {
    // return true if the job is completed else otherwise
    return new Promise((resolve) => {
        if (jobs[jobId] < 100) {
            setTimeout(() => resolve(false), 1000);
        } else {
            resolve(true);
        }
    });
}

server.listen(8000, () => console.log("server is listening on port 8000"));
