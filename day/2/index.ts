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
    let skipLine = false;
    const games: { red: number, blue: number, green: number }[] = [];

    const gameNumberMatch = line.match(/^Game (\d+):/);
    const gameNumber = parseInt(gameNumberMatch[1]);

    const gameSections = line.split(';');
    gameSections.forEach(section => {
      const game = { red: 0, blue: 0, green: 0 };
      const matches = section.matchAll(/(\d+) (red|blue|green)/g);
      for (const match of matches) {
        if (match[2]) {
          game[match[2]] += parseInt(match[1]);
        }
      }
      games.push(game);
    });

    games.forEach(game => {
      if (game.red > 12 || game.green > 13 || game.blue > 14) {
        skipLine = true;
      }
    });

    if (!skipLine) {
      totalSum += gameNumber;
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
