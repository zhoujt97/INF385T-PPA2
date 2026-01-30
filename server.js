import http from "http";
import fs from "fs";

console.log("=== Starting server.js ===");

const slots = [
  {
    id: 1,
    startTime: "2026-03-01T09:00",
    endTime: "2026-03-01T09:30",
    status: "available"
  },
  {
    id: 2,
    startTime: "2026-03-01T10:00",
    endTime: "2026-03-01T10:30",
    status: "available"
  },
  {
    id: 3,
    startTime: "2026-03-01T11:00",
    endTime: "2026-03-01T11:30",
    status: "available"
  },
  {
    id: 4,
    startTime: "2026-03-01T14:00",
    endTime: "2026-03-01T14:30",
    status: "available"
  },
  {
    id: 5,
    startTime: "2026-03-01T15:00",
    endTime: "2026-03-01T15:30",
    status: "booked"
  }
];

const server = http.createServer((req, res) => {
  console.log("Request:", req.method, req.url);

  if (req.url === "/api/slots" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(slots));
    return;
  }

  let filePath = "./public/index.html";
  let contentType = "text/html";

  if (req.url === "/provider") {
    filePath = "./public/provider.html";
  } else if (req.url === "/client") {
    filePath = "./public/client.html";
  } else if (req.url === "/client.js") {
    filePath = "./public/client.js";
    contentType = "text/javascript";
  } else if (req.url === "/provider.js") {
    filePath = "./public/provider.js";
    contentType = "text/javascript";
  } else if (req.url === "/") {
    filePath = "./public/index.html";
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error("Error:", err.message);
      res.writeHead(500);
      res.end("Server error");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(3000, () => {
  console.log("==========================================");
  console.log("✅ Server running at http://localhost:3000");
  console.log("==========================================");
});

console.log("=== Setup complete ===");