import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { drawInput, getHighestIndex, readDataSet } from "./util";
import { SigmoidActivationLayer } from "../../lib/activation/Sigmoid";
import { ZeroInitialization } from "../../lib/initialization/Zero";
import { SoftmaxActivationLayer } from "../../lib/activation/Softmax";

// Dataset can be found here: https://www.kaggle.com/competitions/digit-recognizer/overview
// Unzip it and move it to this directory
const trainingSet = readDataSet('./src/solutions/mnist/train.csv', 256, 256);
// const testSet = readDataSet('./src/solutions/mnist/test.csv');

const network = new NeuralNetwork([
  new NetworkLayer({
    inputSize: 784,
    outputSize: 512,
    weightsInitialization: XavierInitialization(512),
    activationLayer: SigmoidActivationLayer
  }),
  new NetworkLayer({
    inputSize: 512,
    outputSize: 10,
    weightsInitialization: ZeroInitialization,
    activationLayer: SoftmaxActivationLayer
  })
]);

network.load('mnist');
network.fit(trainingSet, 60, 0.1, true);
network.save('mnist');

let errorCount = 0;
for (const test of trainingSet) {
  const prediction = network.predict(test.input);
  const numPrediction = getHighestIndex(prediction);
  const expectedNum = getHighestIndex(test.expectedOutput);
  if (numPrediction !== expectedNum) {
    errorCount++;
  }
}

const accuracy = ((trainingSet.length - errorCount) / trainingSet.length) * 100;
console.log(`Accuracy is: ${accuracy}%`);

