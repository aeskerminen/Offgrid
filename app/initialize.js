const fs = require("fs");
const csv = require("csv-parser");
const util = require("util");
const stream = require("stream");

const pipeline = util.promisify(stream.pipeline);

const sql = require("./database");

const dataLocation = "./data/cities15000.csv";

const insertData = async (data) => {
  const query = sql`
    INSERT INTO geonames (geonameid, name, latitude, longitude, cc, timezone)
    VALUES (
      ${data.geonameid},
      ${data.name},
      ${data.latitude},
      ${data.longitude},
      ${data.cc},
      ${data.timezone}
    )
  `;

  try {
    await query;
  } catch (err) {
    console.error("Error inserting to database.");
  }
};

const initializeDatabase = async () => {
  fs.createReadStream(dataLocation)
    .pipe(csv({ separator: "\t" }))
    .on("data", (row) => {
      insertData(row);
    })
    .on("end", () => {
      console.log("CSV succesfully parsed!");
    })
    .on("error", (err) => {
      console.error("Error parsing CSV file: ", err);
    });
};

module.exports = initializeDatabase;
