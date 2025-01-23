# Backend Engineering

An overview of backend engineering fundamental concepts from communication protocols to execution patterns.

## Communication Design Patterns

### [Sync vs Async](./sync-async)

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

### [Push](./push)

For cases where request-response model falls short in delivering realtime data, the push model is ideal as it allows the server to send data to the client at its desired moment. A popular implementation of this model is the use of websockets to establish a bidirectional communication between two programs. The server can push updates to the client at any point in time without requiring the client to first initiate a request for data. While this model is ideal for realtime data delivery, it falls short in instances where clients are lightweight and may not be able to process data sent to them by the server. RabbitMQ uses this implementation for its queue-consumer communication by pushing events to the consumers once it gets to the queue. Consumers with low processing capabilities may get overwhelmed by the volume of events it receives.
Websocket is a protocol built on top of TCP to allow bidirectional and realtime communication. It works by first initiation an HTTP connection where it is then upgraded into a websocket after a handshake. Once the connection is established, it remains open until the client or server closes it. Heartbeat messages, aka ping/pong, can be sent to the connected clients to ensure that the server keeps track of only healthy clients. The server sends a ping message to the client and listen to pong messages in timely intervals to update client status.

The push model is demonstrated by running the code below

```bash
cd push

// start server code
node index.js

// serve html file
start index.html
```

### [Short Polling](./polling)

Imagine a client has requested for a long running task to be executed but the server never responds immediately so the client has to wait till the whole process is completed an acknowledgement is received. What if our server decides to assign a unique task ID to the client and ask it periodically send check the status of the task? This allows the client to perform other duties while knowing that their request is being processed.

A short polling approach is demonstrated below.

1. Start the server

    ```bash
    cd short-polling

    node index.js
    ```

2. Submit request to create new task

    ```bash
    curl -X POST http://localhost:8000/submit
    ```

3. Check status of job

    ```bash
    # run this request after every 2 seconds

    curl http://localhost:8000/check-status?jobId=<replace-with-job-id-from-previous-request>
    ```
