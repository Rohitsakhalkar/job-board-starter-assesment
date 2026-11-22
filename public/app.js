const list = document.getElementById("jobs");
const search = document.getElementById("search");
const savedList = document.getElementById("saved-jobs")

async function show(query = "") {
  const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
  const jobs = await res.json();
  list.innerHTML = "";
  for (const job of jobs) {
    const li = document.createElement("li");
    li.innerHTML = `
    <p>${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.</p>
    <button>save</button>`;
    list.append(li);
    const button = li.querySelector('button')
    button.addEventListener("click", async () => {
       const buttonRes = await fetch(`/api/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jobId : job.id
        })
       })
      showSavedJobs()
    });
  }
}

async function showSavedJobs(){
  const res = await fetch(`/api/saved`);
  const jobs = await res.json();
  savedList.innerHTML = "";
  for (const job of jobs){
    const li = document.createElement("li");
    li.innerHTML = `
    <p>${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.</p>
    <button>Remove</button>`;
    savedList.append(li)
    const button = li.querySelector('button')
    button.addEventListener("click", async () => {
       const buttonRes = await fetch(`/api/saved/${job.id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }}
       )
       showSavedJobs()
    });
  }
}

search.addEventListener("input", () => show(search.value));
show();
showSavedJobs();