import * as fs from 'fs';
import Matrix from "../../lib/Matrix";
import { DataSet } from '../../lib/Types';

export const readDataSet = (fileName: string, sizeLimit: number, normalizeMax: number): DataSet[] => {
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

  const lines = file.split(/\n/).slice(1).slice(0, -1);
  for (const line of lines) {
    if (dataSet.length >= sizeLimit) {
      break;
    }

    const input = line.split(',').map(el => Number(el));
    const expectedOutput = input.shift();

    dataSet.push({
      input: new Matrix([input.map(e => e / normalizeMax)]),
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

export const drawInput = (input: Matrix) => {
  const kek = input.value[0];
  for (let i = 0; i < 28; i++) {
    const startIndex = i * 28;
    const endIndex = (i * 28) + 28;
    console.log(kek.slice(startIndex, endIndex).map(v => v > 0 ? 1 : 0).join(''));
  }
};