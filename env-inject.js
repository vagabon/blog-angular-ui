const fs = require("fs");
const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) throw result.error;

fs.writeFileSync("./public/env.json", JSON.stringify(result.parsed, null, 2));
