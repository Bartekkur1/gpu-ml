import { readData, readTestData } from './dataParse';
import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { SigmoidActivationLayer } from "../../lib/activation/Sigmoid";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { ZeroInitialization } from "../../lib/initialization/Zero";
import { SimpleLoss } from "../../lib/loss/Sub";
import { SoftmaxActivationLayer } from '../../lib/activation/Softmax';
import * as fs from 'fs';
import { roundPrediction } from './util';

// https://www.kaggle.com/competitions/spaceship-titanic
const data = readData();
// const data = readTestData();

const network = new NeuralNetwork({
  lossFunction: SimpleLoss,
  networkCache: 'titanic'
}, [
  new NetworkLayer({
    inputSize: 13,
    outputSize: 10,
    activationLayer: SigmoidActivationLayer,
    weightsInitialization: XavierInitialization(10)
  }),
  new NetworkLayer({
    inputSize: 10,
    outputSize: 2,
    activationLayer: SoftmaxActivationLayer,
    weightsInitialization: ZeroInitialization
  })
]);

// ======================= TRAIN + TEST ==================================================

network.fit(data, 100, 0.1, true);

let errorCount = 0;
for (const test of data) {
  const prediction = network.predict(test.input);
  const predictionRounded = roundPrediction(prediction);

  if (predictionRounded[0] !== test.expectedOutput.getRow(1)[0]) {
    errorCount++;
  }
}

console.log(`${errorCount} errors on set of ${data.length} records`);
const accuracy = ((data.length - errorCount) / data.length) * 100;
console.log(`Accuracy is: ${accuracy}%`);

// ======================= TEST ON SAMPLE ================================================

// let fileString = 'PassengerId,Transported\n';

// for (const test of data) {
//   const prediction = network.predict(test.input);
//   const transported = roundPrediction(prediction)[0] === 1;
//   fileString += `${test.passengerId},${transported ? 'True' : 'False'}\n`;
// }

// fs.writeFileSync('./sample_submission1.csv', fileString);