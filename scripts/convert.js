const csv = require("csvtojson");
const fs = require("fs");

const files = [
  { name: "SDE Delivery Assignment Room_information.csv", output: "roomInfo.json" },
  { name: "SDE Delivery Assignment Rules.csv", output: "rules.json" },
  { name: "SDE Delivery Assignment Queries.csv", output: "queries.json" },
  { name: "SDE Delivery Assignment Pricing.csv", output: "pricing.json" }
];

files.forEach(file => {
  csv().fromFile(`data/${file.name}`).then(json => {
    fs.writeFileSync(`data/${file.output}`, JSON.stringify(json, null, 2));
    console.log(`Converted ${file.name}`);
  });
});
