import * as fs from 'fs';
import Matrix from "../../lib/Matrix";
import { DataSet } from '../../lib/Types';

interface ReadConfig {
  fileName: string;
  sizeLimit?: number;
  normalizeMax?: number;
  pickRandom?: boolean;
}

const generateRandomIndexes = (amount: number, max: number) => {
  const randIndexes: number[] = [];
  while (randIndexes.length < amount) {
    const randIndex = Math.ceil((Math.random() * max));
    if (!randIndexes.includes(randIndex)) {
      randIndexes.push(randIndex);
    }
  }
  return randIndexes;
};

export const readDataSet = ({ fileName, sizeLimit, normalizeMax, pickRandom }: ReadConfig): DataSet[] => {
  const dataSet: DataSet[] = [];
  const start = Date.now();

  const file = fs.readFileSync(fileName, {
    encoding: 'utf-8'
  });

  const mapExpectedOutput = (output: number) => {
    const expectedOutput = Matrix.createBySize(1, 10);
    expectedOutput.value[0][output] += 1
    return expectedOutput;
  };

  let lines = file.split(/\n/).slice(1).slice(0, -1);
  if (pickRandom && sizeLimit) {
    lines = generateRandomIndexes(sizeLimit, lines.length).map(n => lines[n]);
  }

  for (const line of lines) {
    if (sizeLimit && dataSet.length >= sizeLimit) {
      break;
    }

    const input = line.split(',').map(el => Number(el));
    const expectedOutput = input.shift();

    dataSet.push({
      input: new Matrix([input.map(e => normalizeMax ? e / normalizeMax : e)]),
      expectedOutput: mapExpectedOutput(expectedOutput)
    });
  }

  console.log(`Loaded dataset ${fileName} ${dataSet.length} records in ${Date.now() - start}ms`);
  return dataSet;
};

export const getHighestIndex = (matrix: Matrix) => {
  let highestIndex = 0;
  let highestValue = 0;
  const row = matrix.getRow(1);
  for (let index = 0; index <= 10; index++) {
    if (row[index] > highestValue) {
      highestValue = row[index];
      highestIndex = index;
    }
  }

  return highestIndex;
};

export const drawMnistInput = (input: Matrix) => {
  const kek = input.value[0];
  for (let i = 0; i < 28; i++) {
    const startIndex = i * 28;
    const endIndex = (i * 28) + 28;
    console.log(kek.slice(startIndex, endIndex).map(v => v > 0 ? 1 : 0).join(''));
  }
};