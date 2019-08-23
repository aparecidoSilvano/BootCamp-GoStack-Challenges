const express = require("express");
const server = express();

server.use(express.json());

// Middlewares
var requestsCounter = 0;

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Method: ${req.method}; URL: ${req.url}`);
  requestsCounter++;

  console.log("Requests until now: " + requestsCounter);

  next();
  console.timeEnd("Request");
});

function checkProjectInArray(req, res, next) {
  if (!findProjectById(req.params.id)) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}
// End of middlewares

function findProjectById(id) {
  return projects.find(project => {
    return project.id == id;
  });
}

var projects = [];

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const projectFound = findProjectById(id);

  return res.json(projectFound);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  const projectFound = findProjectById(id);
  if (projectFound) {
    return res
      .status(400)
      .json({ error: `Already exists an project with id=${id}` });
  }

  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = findProjectById(id);
  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const project = findProjectById(id);
  const index = projects.indexOf(project);

  projects.splice(index, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = findProjectById(id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
