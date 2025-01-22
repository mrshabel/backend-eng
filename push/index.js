const http = require("http");
const WebSocket = require("ws");
const WebSocketServer = WebSocket.WebSocketServer;

// create a raw HTTP server which will be upgraded into a websocket connection
const httpServer = http.createServer();

// create websocket server instance
const websocketServer = new WebSocketServer({
    server: httpServer,
});
// listen on TCP socket
httpServer.listen(8080, () => console.log("Server is listening on port 8080"));

// listen to websocket connections and process requests
websocketServer.on("connection", function connection(websocket, req) {
    // mark client as alive
    websocket.isAlive = true;

    // assign unique id to client
    // const params = new URLSearchParams(req.url.split("?")[1]);
    // websocket.id = params.get("id") || `guest_${Date.now()}`;
    // console.log(`Client connected with ID: ${websocket.id}`);

    websocket.on("error", (err) => console.error(err));

    websocket.on("message", function message(data, isBinary) {
        const parsedData = JSON.parse(data.toString());
        console.log("received:", parsedData);

        const senderId = parsedData.username;
        // clients will now send ID as username in data
        if (!websocket.id && parsedData.type === "join") {
            websocket.id = senderId;

            // notify all clients that a new client has connected
            websocketServer.clients.forEach((client) => {
                // check if client is still connected
                if (client.readyState === WebSocket.OPEN) {
                    // send user count
                    client.send(
                        JSON.stringify({
                            type: "userCount",
                            username: senderId,
                            count: websocketServer.clients.size,
                        })
                    );
                    // send notification of user joining
                    client.send(
                        JSON.stringify({
                            username: senderId,
                            message: `"${senderId}" just joined the chat`,
                        })
                    );
                }
            });
            return;
        }

        // broadcast message to all connected clients including itself
        websocketServer.clients.forEach((client) => {
            // check if client is still connected
            if (client.readyState === WebSocket.OPEN) {
                const res = {
                    username: senderId,
                    message: parsedData.message,
                };
                client.send(JSON.stringify(res));
            }
        });
    });

    // notify all clients that a new client has connected
    // websocketServer.clients.forEach((client) => {
    //     // check if client is still connected
    //     if (client.readyState === WebSocket.OPEN) {
    //         client.send(
    //             JSON.stringify({
    //                 username: client.id,
    //                 message: `New client just connected: ${client.id}`,
    //             })
    //         );
    //     }
    // });

    // websocket.send("something");

    // handle ping/pong frames. this helps to keep connection alive and detect broken client
    // send periodic pings to client
    const interval = setInterval(() => {
        websocketServer.clients.forEach((client) => {
            // terminate dead client connections
            if (!client.isAlive) {
                return client.terminate();
            }

            client.isAlive = false;
            client.ping();
        });
    }, 3000);

    // receive pong event
    websocket.on("pong", () => {
        websocket.isAlive = true;
    });

    websocket.on("close", function close() {
        clearInterval(interval);
    });
});

// NOTE: old websocket library implementation
// // store websocket connections in array
// const connections = [];

// // listen to websocket connections and process requests
// websocket.on("request", (request) => {
//     // accept connection
//     const connection = request.accept(null, request.origin);

//     // store connection
//     connections.push(connection);

//     // alert all online members that a new client just connected
//     connections.forEach((c) =>
//         c.send(`User ${connection.socket.remotePort} just connected!`)
//     );

//     // listen to client message
//     connection.on("message", (message) => {
//         // notify everyone about message sent from client with the remote port as unique identifier
//         connections.forEach((c) =>
//             c.send(
//                 `User ${connection.socket.remotePort} says: ${message.utf8Data}`
//             )
//         );
//     });
// });
