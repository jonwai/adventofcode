import * as fs from "fs";
import * as readline from "readline";

const fileName = process.argv[2];

interface NumberWithPosition {
  value: number;
  line: number;
  column: number;
  length: number;
}

interface Coordinate {
  line: number;
  column: number;
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

function checkGears(
  numberInfo: NumberWithPosition,
  lines: string[]
): Coordinate[] {
  let gears: Coordinate[] = [];

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
        if (char === "*") {
          gears.push({ line: adjRow, column: adjCol });
        }
      }
    }
  }
  return Array.from(new Set(gears));
}

export async function processFile(filePath: string, part = 2): Promise<number> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lines: string[] = [];
  let numbersWithPositions: NumberWithPosition[] = [];
  let totalSum = 0;
  let lineNumber = 0;
  const gearMap = new Map<string, Set<number>>();

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

  numbersWithPositions.forEach((numberInfo) => {
    if (part === 1 && checkAdjacents(numberInfo, lines)) {
      totalSum += numberInfo.value;
    } else if (part === 2) {
      const gears = checkGears(numberInfo, lines);
      gears.forEach((gear) => {
        const key = `${gear.line},${gear.column}`;
        if (!gearMap.has(key)) {
          gearMap.set(key, new Set());
        }
        gearMap.get(key).add(numberInfo.value);
      });
    }
  });

  rl.close();

  gearMap.forEach((values, _) => {
    if (values.size === 2) {
      const product = Array.from(values).reduce((a, b) => a * b);
      totalSum += product;
    }
  });

  return totalSum;
}

if (!fileName) {
  console.error("Please provide a file name as an argument.");
  process.exit(1);
}

if (fileName !== "index.test.ts") {
  processFile(fileName)
    .then((totalSum) => console.log("Total Sum:", totalSum))
    .catch(console.error);
}
