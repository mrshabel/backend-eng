const fs = require("fs");

console.log("1. starting...");

// read contents of a file synchronously. this operation blocks the main thread until all contents of the file has been read.
const content = fs.readFileSync("test.txt");
console.log("file content:", content.toString());

// this code does not execute until the code above is done executing since it is a synchronous operation
console.log("2. ending...");
