import * as fs from "fs";
import * as readline from "readline";

const fileName = process.argv[2];

async function processFile(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalSum = 0;

  for await (const line of rl) {
    const digits = line.replace(/\D/g, "");

    if (digits.length > 0) {
      const firstDigit = digits.charAt(0);
      const lastDigit = digits.charAt(digits.length - 1);

      const number = parseInt(firstDigit + lastDigit, 10);

      totalSum += number;
    }
  }

  rl.close();

  console.log("Total Sum:", totalSum);
}

if (!fileName) {
  console.error("Please provide a file name as an argument.");
  process.exit(1);
}

processFile(fileName).catch(console.error);
