# Job board starter

A small job board for an insiderOne work sample. It is made up: the jobs and
companies are not real.

## Run it

You need Node 20 or newer. There are no packages to install.

```
npm start      # then open http://localhost:3000
npm test       # runs the tests in test/
```

## What is here

- `server.js`: the web server. `GET /api/jobs?q=` lists jobs, `GET /` serves the page.
- `lib/jobs.js`: reading and searching the jobs. Pure functions.
- `jobs.json`: the jobs.
- `public/`: the page and its script.
- `test/`: tests, using Node's built-in test runner.

## Your task

See the work sample brief on insiderOne: add saved jobs (save, list, remove),
with tests, and add a short section to this README about what you built.

## What I built

Implemented a saved jobs feature that allows users to save jobs, view their saved jobs, and remove jobs from the saved list.

### Features

- Save jobs using a Save button.
- View saved jobs in a separate list on the same page.
- Remove jobs from the saved list.
- Prevent duplicate saved jobs.
- Persist saved jobs using a JSON file.
- Validate job IDs and handle invalid requests.

### Implementation

Added API endpoints for saving, retrieving, and removing saved jobs. The saved job IDs are stored in `saved_jobs.json`, while job details are retrieved from the existing jobs dataset.

The implementation uses Node.js's built-in HTTP server and file system modules, without additional dependencies.

### Testing

Added tests using Node.js's built-in test runner to verify saving jobs, duplicate prevention, retrieving saved jobs, removing jobs, and handling invalid job IDs.

### Future improvements

- Add better frontend feedback for API errors.
- Add HTTP integration tests.
- Improve the user interface and responsiveness.
- Replace JSON storage with a database if needed.

### AI Disclosure

AI was used for guidance, debugging, code review, and explaining concepts during development. The implementation and testing were carried out by me with AI assistance.