import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { getHighestIndex, readDataSet, readTrainDataSet } from "./util";
import { SoftmaxActivationLayer } from "../../lib/activation/Softmax";
import { SimpleLoss } from "../../lib/loss/Sub";
import * as fs from 'fs';

// Dataset can be found here: https://www.kaggle.com/competitions/digit-recognizer/overview
// Unzip it and move it to this directory
const trainingSet = readDataSet({
  fileName: './src/solutions/mnist/train.csv',
  normalizeMax: 256
});

const network = new NeuralNetwork({
  lossFunction: SimpleLoss,
  networkCache: 'mnist'
}, [
  new NetworkLayer({
    inputSize: 784,
    outputSize: 10,
    weightsInitialization: XavierInitialization(784),
    activationLayer: SoftmaxActivationLayer
  })
]);

// ==================== Submission calc ========================================

// const testSet = readTrainDataSet({
//   fileName: './src/solutions/mnist/test.csv',
//   normalizeMax: 256
// });

// let file = 'ImageId,Label\n';
// for (let i = 0; i <= testSet.length - 1; i++) {
//   const prediction = getHighestIndex(network.predict(testSet[i].input));
//   file += `${i + 1},${prediction}\n`;
// }

// fs.writeFileSync('./sample_submission.csv', file);


// ==================== Training + Error calc ================================

// network.fit(trainingSet, 100, 0.1, true);

// const accuracyTestSet = readDataSet({
//   fileName: './src/solutions/mnist/train.csv',
//   normalizeMax: 256
// });

// let errorCount = 0;
// for (const test of accuracyTestSet) {
//   const prediction = network.predict(test.input);
//   const numPrediction = getHighestIndex(prediction);
//   const expectedNum = getHighestIndex(test.expectedOutput);
//   if (numPrediction !== expectedNum) {
//     errorCount++;
//   }
// }

// console.log(`${errorCount} errors on set of ${accuracyTestSet.length} records`);
// const accuracy = ((accuracyTestSet.length - errorCount) / accuracyTestSet.length) * 100;
// console.log(`Accuracy is: ${accuracy}%`);

// ===========================================================================
