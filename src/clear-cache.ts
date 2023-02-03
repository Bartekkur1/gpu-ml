import * as fs from 'fs';
import { createInterface } from 'readline';
import { stdin, stdout } from 'node:process';

const dir = fs.readdirSync('./cache');

if (dir.length === 0) {
  console.log('Cache is clear!');
  process.exit();
}

console.log(`Files to be removed:`);
console.log(dir.join('\n') + '\n');

const input = createInterface({ input: stdin, output: stdout });
input.question('Are you sure you want to clear cache? Y/N: ', answer => {
  if (answer === 'Y') {
    for (const file of dir) {
      console.log(`Removing file ${file}...`);
      fs.unlinkSync(`./cache/${file}`);
    }
  }
  input.close();
});
