const fs = require("fs");
const readline = require("readline");
const path = require("path");

async function extractLogs(date) {
  const inputFilePath = path.join(__dirname, "test_logs.log");
  const outputDir = path.join(__dirname, "../output");
  const outputFilePath = path.join(outputDir, `output_${date}.txt`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const outputStream = fs.createWriteStream(outputFilePath);

  let found = false;
  for await (const line of rl) {
    if (line.startsWith(date)) {
      outputStream.write(line + "\n");
      found = true;
    }
  }

  if (!found) {
    console.log(`No log entries found for date: ${date}`);
  }

  outputStream.end();
}

const date = process.argv[2];
if (!date) {
  console.error("Usage: node extract_logs.js <YYYY-MM-DD>");
  process.exit(1);
}

extractLogs(date).catch((err) => {
  console.error(err);
  process.exit(1);
});
