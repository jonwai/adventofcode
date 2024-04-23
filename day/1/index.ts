import * as fs from "fs";
import * as readline from "readline";

const fileName = process.argv[2];

const wordToDigit: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

async function processFile(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalSum = 0;

  for await (const line of rl) {
    let mapped: string[] = [];
    let position = 0;

    while (position < line.length) {
      let found = false;

      for (const [word, digit] of Object.entries(wordToDigit)) {
        if (line.substring(position).startsWith(word)) {
          mapped.push(digit);
          position += word.length;
          found = true;
          break;
        }
      }

      if (!found) {
        if (/\d/.test(line[position])) {
          mapped.push(line[position]);
        }
        position++;
      }
    }

    if (mapped.length > 0) {
      const firstDigit = mapped[0];
      const lastDigit = mapped[mapped.length - 1];
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
