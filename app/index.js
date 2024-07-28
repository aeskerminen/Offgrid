const express = require("express");
const app = express();

const fs = require("fs");
const csv = require("csv-parser");

const sql = require("./database");

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
    console.error("Error inserting to database:", err);
  }
};

fs.createReadStream("./cities15000.csv")
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

app.get("/api/data/:id", async (req, res) => {
  const id = req.params.id;
  const result = await sql`SELECT * FROM geonames WHERE geonameid = ${id}`;

  return res.json({
    data: result[0],
  });
});

app.get("/api/data/:lat/:lon", async (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;

  console.log(lat, lon);

  const result = await sql`
  SELECT 
      *, 
      (
          6371 * acos (
          cos ( radians(${lat}) )
          * cos( radians( latitude ) )
          * cos( radians( longitude ) - radians(${lon}) )
          + sin ( radians(${lat}) )
          * sin( radians( latitude ) )
          )
      ) AS distance
  FROM 
      geonames
  ORDER BY 
      distance
  LIMIT 1;
`;

  return res.json({ data: result[0] });
});

app.listen(8000, () => {
  console.log(`Offgrid runnning on port ${8000}.`);
});
