const fs = require("fs");

console.log("1. starting...");

// read contents of a file asynchronously.
// node js creates a secondary thread (when epoll and io_uring is unavailable) to process the file reading (a blocking task) then allow the main thread to operate freely without blocking it.
// the main thread does not wait for the contents of the file to be written before running subsequent lines of code.
fs.readFile("test.txt", (err, data) => {
    if (err) throw err;
    console.log("file content:", data.toString());
});

console.log("2. ending...");
