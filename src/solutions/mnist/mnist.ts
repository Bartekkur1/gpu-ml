import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { getHighestIndex, readDataSet } from "./util";
import { SigmoidActivationLayer } from "../../lib/activation/Sigmoid";
import { ZeroInitialization } from "../../lib/initialization/Zero";
import { SoftmaxActivationLayer } from "../../lib/activation/Softmax";
import { SimpleLoss } from "../../lib/loss/Sub";
import { CreateSimpleStop } from "../../lib/stop/SimpleStop";

// Dataset can be found here: https://www.kaggle.com/competitions/digit-recognizer/overview
// Unzip it and move it to this directory
const trainingSet = readDataSet({
  fileName: './src/solutions/mnist/train.csv',
  pickRandom: true,
  normalizeMax: 256,
  sizeLimit: 1024
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

network.fit(trainingSet, 60, 0.1, true);

const testSet = readDataSet({
  fileName: './src/solutions/mnist/train.csv',
  normalizeMax: 256
});

let errorCount = 0;
for (const test of testSet) {
  const prediction = network.predict(test.input);
  const numPrediction = getHighestIndex(prediction);
  const expectedNum = getHighestIndex(test.expectedOutput);
  if (numPrediction !== expectedNum) {
    errorCount++;
  }
}

console.log(`${errorCount} errors on set of ${testSet.length} records`);
const accuracy = ((testSet.length - errorCount) / testSet.length) * 100;
console.log(`Accuracy is: ${accuracy}%`);
