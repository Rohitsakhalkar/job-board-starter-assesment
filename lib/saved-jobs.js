import {loadJobs, findJob} from "./jobs.js";
import { Storage } from "../lib/storage.js";

const path = new URL("../saved_jobs.json",import.meta.url)
const defaultStorage = new Storage(path)

export const loadSavedJobs = async (storage = defaultStorage) => {
    const content = await storage.read()
    return JSON.parse(content)
}

export const saveJob = async (jobId, storage = defaultStorage) => {
    const jobs = await loadJobs()
    if (findJob(jobs, jobId) === null){
        return { message : "job not found" }
    }
    const savedJobs = await loadSavedJobs(storage)
    if (savedJobs.includes(jobId)){
        return { message : "already saved" }
    }
    savedJobs.push(jobId)
    await storage.write(savedJobs)
    return { message : "saved successfully" }
}

export const getSavedJobs = async (storage = defaultStorage) => {
    const savedJobs = await loadSavedJobs(storage)
    const jobs = await loadJobs()
    return jobs.filter(job => savedJobs.includes(job.id)) 
}

export const removeSavedJob =  async (jobId, storage = defaultStorage) => {
    const savedJobs = await loadSavedJobs(storage)
    if (!savedJobs.includes(jobId)){
        return { message : "job not found" }
    }
    const updatedJobs = savedJobs.filter(id => id !== jobId)
    await storage.write(updatedJobs)
    return { message : "successfully removed" }
}