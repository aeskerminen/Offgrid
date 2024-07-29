const app = require("./app");
const initializeDatabase = require("./initialize");

const runApp = async () => {
  await initializeDatabase();

  app.listen(8000, () => {
    console.log(`Offgrid runnning on port ${8000}.`);
  });
};

runApp();
