import * as fs from 'fs';
import Matrix from '../../lib/Matrix';
import { DataSet } from '../../lib/Types';

const PlanetsScore = {
  '': 0,
  'Europa': 0.33,
  'Earth': 0.66,
  'Mars': 1
};

const DestinationScore = {
  '': 0,
  'TRAPPIST-1e': 0.33,
  'PSO J318.5-22': 0.66,
  '55 Cancri e': 1
};

const BooleanScore = {
  'True': 1,
  'False': 0
};

const CabinTypeScore = {
  'P': 0.5,
  'S': 1
};

const getUniqueSet = (dataSet: any[], name: string) => {
  return new Set(dataSet.map(e => e[name]));
};

const findNumericalNormalization = (dataSet: any[], name: string) => {
  const uniqueSet = Array.from(getUniqueSet(dataSet, name)).map(Number);
  return {
    max: Math.max(...uniqueSet),
    min: Math.min(...uniqueSet)
  }
};

const readRawRecords = (fileName: string) => {
  const file = fs.readFileSync(fileName, 'utf-8');
  const lines = file.split(/\n/);
  const labels = lines.shift().split(',');

  const rawRecords = [];

  for (const line of lines.slice(0, -1)) {
    const dataUnit = {};
    const lineData = line.split(',');
    for (let i = 0; i < labels.length; i++) {
      dataUnit[labels[i]] = lineData[i];
    }
    rawRecords.push(dataUnit);
  }

  return rawRecords;
};

const findNorms = (rawRecords: any[]) => {
  const norms = {};
  norms['ageNorm'] = findNumericalNormalization(rawRecords, 'Age');
  norms['roomServiceNorm'] = findNumericalNormalization(rawRecords, 'RoomService');
  norms['foodCourtNorm'] = findNumericalNormalization(rawRecords, 'FoodCourt');
  norms['shoppingMallNorm'] = findNumericalNormalization(rawRecords, 'ShoppingMall');
  norms['spaMallNorm'] = findNumericalNormalization(rawRecords, 'Spa');
  norms['vrDeckNorm'] = findNumericalNormalization(rawRecords, 'VRDeck');

  norms['cabinNumbers'] = rawRecords.filter(r => r.Cabin !== '').map(r => r.Cabin.split('/')[1]);
  norms['cabinNumMax'] = Math.max(...norms['cabinNumbers'].map(Number));
  norms['roomCharMax'] = 'Z'.charCodeAt(0) - 65;

  return norms;
};

const extractRecord = (record: any, norms: any): any => {
  let cabinLabel = 0;
  let cabinNumber = 0;
  let cabinType = 0;
  if (record.Cabin !== '') {
    const cabinSplit = record.Cabin.split('/');
    cabinLabel = (cabinSplit[0].charCodeAt(0) - 65) / norms['roomCharMax'];
    cabinNumber = Number(cabinSplit[1]) / norms['cabinNumMax'];
    cabinType = CabinTypeScore[cabinSplit[2]];
  }

  const parsedRecord = {
    HomePlanet: PlanetsScore[record.HomePlanet],
    CryoSleep: BooleanScore[record.CryoSleep] || 0,
    Destination: DestinationScore[record.Destination],
    Age: Number(record.Age) / norms['ageNorm'].max,
    VIP: BooleanScore[record.VIP] || 0,
    RoomService: Number(record.RoomService) / norms['roomServiceNorm'].max,
    FoodCourt: Number(record.FoodCourt) / norms['foodCourtNorm'].max,
    ShoppingMall: Number(record.ShoppingMall) / norms['shoppingMallNorm'].max,
    Spa: Number(record.Spa) / norms['spaMallNorm'].max,
    VRDeck: Number(record.VRDeck) / norms['vrDeckNorm'].max,
    CabinLabel: cabinLabel,
    CabinNumber: cabinNumber,
    CabinType: cabinType
  };

  return parsedRecord;
};

export const readData = (): DataSet[] => {
  const rawRecords = readRawRecords('./src/solutions/spaceship-titanic/train.csv');
  const dataSet: DataSet[] = [];

  const norms = findNorms(rawRecords);

  for (const record of rawRecords) {
    const parsedRecord = extractRecord(record, norms);

    dataSet.push({
      expectedOutput: new Matrix([BooleanScore[record.Transported] === 1 ? [1, 0] : [0, 1]]),
      input: new Matrix([Object.values(parsedRecord)])
    });
  }

  return dataSet;
};

export const readTestData = (): { passengerId: string, input: Matrix }[] => {
  const rawRecords = readRawRecords('./src/solutions/spaceship-titanic/test.csv');

  const dataSet: { passengerId: string, input: Matrix }[] = [];

  const norms = findNorms(rawRecords);

  for (const record of rawRecords) {
    const parsedRecord = extractRecord(record, norms);

    dataSet.push({
      passengerId: record.PassengerId,
      input: new Matrix([Object.values(parsedRecord)])
    });
  }

  return dataSet;
};