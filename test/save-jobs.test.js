import {test} from "node:test";
import assert from "node:assert/strict";
import {getSavedJobs, removeSavedJob, saveJob} from "../lib/saved-jobs.js";
import { loadJobs } from "../lib/jobs.js";
import { Storage } from "../lib/storage.js";
import { beforeEach } from "node:test";

const path = new URL("./test-saved-jobs-storage.json", import.meta.url)
const storage = new Storage(path)

beforeEach(async () => {
    await storage.write([]);
});

test("save a job" , async () => {
    const jobs = await loadJobs();
    assert.equal((await saveJob(jobs[0].id,storage)).message, "saved successfully")
    assert.equal((await saveJob(jobs[0].id, storage)).message, "already saved")
    assert.equal((await saveJob("invalid_job_id", storage)).message, "job not found")
});

test("get jobs", async () => {
    const jobs = await loadJobs();
    assert.deepEqual((await getSavedJobs(storage)) , [])
    assert.equal((await saveJob(jobs[0].id,storage)).message, "saved successfully")
    assert.deepEqual((await getSavedJobs(storage)).map(job => job.id), [jobs[0].id])
});

test("delete a job", async () => {
    const jobs = await loadJobs();
    assert.equal((await saveJob(jobs[0].id,storage)).message, "saved successfully")
    assert.equal((await removeSavedJob(jobs[0].id, storage)).message, "successfully removed")
    assert.equal((await removeSavedJob(jobs[0].id, storage)).message, "job not found")
    assert.equal((await removeSavedJob("invalid_job_id", storage)).message, "job not found")
   
});
