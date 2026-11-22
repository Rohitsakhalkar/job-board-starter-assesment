// A small job board: a JSON API and one page. Run with `npm start`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadJobs, searchJobs } from "./lib/jobs.js";
import {saveJob, getSavedJobs, removeSavedJob} from "./lib/saved-jobs.js";

const PORT = Number(process.env.PORT ?? 3000);

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

const readBody = async (req) => {
    const chunks = [];
    for await (const chunk of req){
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString()
    return JSON.parse(body)
};

export function createApp() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (req.method === "GET" && url.pathname === "/api/jobs") {
        const jobs = await loadJobs();
        return sendJson(res, 200, searchJobs(jobs, url.searchParams.get("q")));
      }
      if (req.method === "POST" && url.pathname === "/api/saved"){
        const body = await readBody(req)
        if (!body || body.jobId === null || !body.jobId || typeof body.jobId !== "string" || !body.jobId.trim() ){
            return sendJson(res, 400, { error: "bad request" })
        }
        const savedjob = await saveJob(body.jobId.trim())
        
        if (savedjob.message === "job not found"){
            return sendJson(res, 404, { error: "job not found" })
        }
        if (savedjob.message === "already saved"){
            return sendJson(res, 409, { error: "job already saved" })
        }
        return sendJson(res, 201, savedjob);
      }
      if (req.method === "GET" && url.pathname === "/api/saved"){
        const savedJobs = await getSavedJobs()
        return sendJson(res, 200, savedJobs);
      }
      if (req.method === "DELETE" && url.pathname.startsWith("/api/saved/")){
        const pathList = url.pathname.split('/')
        const jobId = pathList[3]
        if(!jobId  || !jobId.trim()){
            return sendJson(res, 400, { error: "bad request" })
        }
        const removeJob = await removeSavedJob(jobId)
        if (removeJob.message === "job not found"){
            return sendJson(res, 404, { error: "job not found"})
        }
        return sendJson(res, 200, removeJob)
      }
      if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/app.js")) {
        const file = url.pathname === "/" ? "index.html" : "app.js";
        const type = file.endsWith(".html") ? "text/html" : "text/javascript";
        const body = await readFile(new URL(`./public/${file}`, import.meta.url));
        res.writeHead(200, { "content-type": `${type}; charset=utf-8` });
        return res.end(body);
      }
      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      console.error(err);
      if (err instanceof SyntaxError){
        return sendJson(res, 400, { error: "bad request"})
      }
      sendJson(res, 500, { error: "Something went wrong" });
    }
  });
}

// Started directly (npm start), not imported by a test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(PORT, () => console.log(`Job board on http://localhost:${PORT}`));
}
