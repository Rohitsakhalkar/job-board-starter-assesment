// Reading and filtering the jobs. Pure functions, so they are easy to test.
import { Storage } from "../lib/storage.js";

const path = new URL("../jobs.json", import.meta.url)
const storage = new Storage(path)

export async function loadJobs() {
  const raw = await storage.read();
  return JSON.parse(raw);
}

/** Jobs whose title, company or location contains the search words. */
export function searchJobs(jobs, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return jobs;
  return jobs.filter((j) => [j.title, j.company, j.location].some((f) => String(f).toLowerCase().includes(q)));
}

export function findJob(jobs, id) {
  return jobs.find((j) => j.id === id) ?? null;
}
