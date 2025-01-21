# Backend Engineering

An overview of backend engineering fundamental concepts from communication protocols to execution patterns.

## Communication Design Patterns

### [### Sync vs Async](./sync-async)

Synchronous operations are blocking and hence any operation to be executed beneath it has to wait until processing is done. For long running tasks, this blocks the main thread from executing other lines of code over a period.
Considering a task like reading a file from the disk, the backend code has to make a request to the OS file system API which in turn calls the kernel to interact with the device driver and read the contents from disk. Since this operation is out of our code's control, why don't we run the task elsewhere and continue processing our code while waiting for a completion response? This ultimately led to the idea of async programming.
Back to the same scenario of reading a file's content, we can offload the task to a secondary "worker" while we continue processing subsequent lines of code. The epoll, and io_uring mechanisms to handle this asynchronous behavior.
With io_uring, a completion queue to hold all processed "requests" will be created to allow the main thread operate freely without any blocking.
In other cases, a secondary thread can be spin up to run the blocking operation, reading file from disk, while the main thread continues to process other tasks. On completion, the secondary thread notifies the main thread.

The sync and async behavior is demonstrated by running the code below

```bash
cd sync-async

// run synchronous code
node sync.js

// run async code
node async.js
```
