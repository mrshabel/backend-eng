/*
    Client code for SSE
    const sse = new EventSource("http://localhost:8000/stream")
    sse.onmessage = console.log
*/

const http = require("node:http");
const url = require("node:url");

const server = http.createServer(async (req, res) => {
    // extract the request url and method
    const { method, path } = parseRequestHeaders(req);

    // route request to appropriate handler
    if (path === "/stream" && method === "GET") {
        // send response as a stream
        res.writeHead(200, { "Content-Type": "text/event-stream" });
        await sendEventStreamHandler(res);
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>SSE Test</title>
            </head>
            <body>
                <h1>Server-Sent Events</h1>
                <div id="data"></div>
                <script>
                    const sse = new EventSource("http://localhost:8000/stream");
                    sse.onmessage = function(event) {
                        console.log(event)
                        const div = document.getElementById("data");
                        div.innerText += event.data + '\\n';
                    };
                </script>
            </body>
            </html>
        `);
        // notFoundHandler(res);
    }
});

// write event chunks without ending connection
let i = 0;
async function sendEventStreamHandler(res) {
    res.write(`\ndata: hello from server -----[${i++}]\n\n`);

    // stream events after delay
    setTimeout(() => sendEventStreamHandler(res), 1000);
}

function notFoundHandler(res) {
    res.end("\n\nRoute not found\n\n");
}

function parseRequestHeaders(req) {
    const { method, body } = req;
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    return { method, path, query, body };
}

server.listen(8000, () => console.log("SSE server is listening on port 8000"));
