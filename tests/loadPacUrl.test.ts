import { describe, expect, beforeAll, afterAll, test } from "vitest";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import Pacparser from "../src";

let server: ReturnType<typeof createServer>;
let serverUrl: string;

// 创建支持跨域的静态文件服务器
beforeAll((done) => {
  console.log(`Create test server...`);
  // 创建HTTP服务器
  server = createServer((req, res) => {
    // 配置CORS头
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 处理预检请求
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // 处理静态文件请求
    if (req.method === "GET" && req.url === "/proxy.pac") {
      try {
        const content = readFileSync(path.join(__dirname, "proxy.pac"), "utf8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      }
      return;
    }

    res.writeHead(404);
    res.end();
  });

  // 启动服务器
  server.listen(3000, () => {
    console.log(`Test Server listening... `);
  });
});

// 清理资源
afterAll((done) => {
  // 关闭服务器
  server.close(() => {
    console.log("Test Server closed.");
  });
});

describe("pacparser pacUrl", () => {
  test("pacparser pacString", async () => {
    const pacUrl = "http://localhost:3000/proxy.pac";
    const pacParser = new Pacparser();
    await pacParser.loadPacUrl(pacUrl);
    console.log(pacParser.findProxyForURL("https://www.google.com"));
    expect(pacParser.findProxyForURL("https://direct.mozilla.org")).toBe("DIRECT");
  });
});
