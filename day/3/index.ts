import * as fs from "fs";
import * as readline from "readline";

const fileName = process.argv[2];

interface NumberWithPosition {
  value: number;
  line: number;
  column: number;
  length: number;
}

function checkAdjacents(
  numberInfo: NumberWithPosition,
  lines: string[]
): boolean {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let offset = 0; offset < numberInfo.length; offset++) {
    const baseCol = numberInfo.column + offset;
    for (const [dRow, dCol] of directions) {
      const adjRow = numberInfo.line + dRow;
      const adjCol = baseCol + dCol;
      if (
        adjRow >= 0 &&
        adjRow < lines.length &&
        adjCol >= 0 &&
        adjCol < lines[adjRow].length
      ) {
        const char = lines[adjRow][adjCol];
        if (!char.match(/[\d\.]/)) {
          return true;
        }
      }
    }
  }
  return false;
}

async function processFile(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lines: string[] = [];
  let numbersWithPositions: NumberWithPosition[] = [];
  let totalSum = 0;
  let lineNumber = 0;

  for await (const line of rl) {
    lines.push(line);
    let match: RegExpExecArray | null;
    const numberRegex = /\d+/g;
    while ((match = numberRegex.exec(line)) !== null) {
      numbersWithPositions.push({
        value: parseInt(match[0], 10),
        line: lineNumber,
        column: match.index,
        length: match[0].length,
      });
    }
    lineNumber++;
  }
  console.log(numbersWithPositions);

  for (const numberInfo of numbersWithPositions) {
    if (checkAdjacents(numberInfo, lines)) {
      totalSum += numberInfo.value;
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
