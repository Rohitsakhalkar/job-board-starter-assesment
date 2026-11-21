import {readFile, writeFile} from "node:fs/promises"
import {loadJobs, findJob} from "./jobs.js"

const PATH = new URL("../saved_jobs.json",import.meta.url)

export const loadSavedJobs = async (path = PATH) => {
    const content = await readFile(path, "utf8");
    return JSON.parse(content)
}

export const saveJob = async (jobId) => {
    const jobs = await loadJobs()
    if (findJob(jobs, jobId) === null){
        return "job not found"
    }
    const savedJobs = await loadSavedJobs()
    if (savedJobs.includes(jobId)){
        return "already saved"
    }
    savedJobs.push(jobId)
    await writeFile(PATH ,JSON.stringify(savedJobs, null , 2))
    return "saved successfully"
}

export const getSavedJobs = async () => {
    const savedJobs = await loadSavedJobs()
    const jobs = await loadJobs()
    return jobs.filter(job => savedJobs.includes(job.id)) 
}

export const removeSavedJob =  async (jobId) => {
    const savedJobs = await loadSavedJobs()
    if (!savedJobs.includes(jobId)){
        return "job not found"
    }
    const updatedJobs = savedJobs.filter(id => id !== jobId)
    await writeFile(PATH, JSON.stringify(updatedJobs, null, 2))
    return "successfully removed"
}