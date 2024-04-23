import * as fs from "fs";
import * as readline from "readline";

const fileName = process.argv[2];

export async function processFile(filePath: string, part = 2): Promise<number> {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalSum = 0;

  for await (const line of rl) {
    const games: { red: number; blue: number; green: number }[] = [];
    const minimums: { red: number; blue: number; green: number } = {
      red: 0,
      blue: 0,
      green: 0,
    };

    const gameNumberMatch = line.match(/^Game (\d+):/);
    const gameNumber = parseInt(gameNumberMatch[1]);

    const gameSections = line.split(";");
    gameSections.forEach((section) => {
      const game = { red: 0, blue: 0, green: 0 };
      const matches = section.matchAll(/(\d+) (red|blue|green)/g);
      for (const match of matches) {
        if (match[2]) {
          game[match[2]] += parseInt(match[1]);
          if (game[match[2]] > minimums[match[2]]) {
            minimums[match[2]] = game[match[2]];
          }
        }
      }
      games.push(game);
    });

    if (part === 1) {
      let skipLine = false;
      games.forEach((game) => {
        if (game.red > 12 || game.green > 13 || game.blue > 14) {
          skipLine = true;
        }
      });
      if (!skipLine) {
        totalSum += gameNumber;
      }
    } else if (part == 2) {
      const power = minimums.red * minimums.green * minimums.blue;
      totalSum += power;
    }
  }

  rl.close();
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
