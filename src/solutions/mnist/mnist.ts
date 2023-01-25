import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { getHighestIndex, readDataSet } from "./util";
import { SigmoidActivationLayer } from "../../lib/activation/Sigmoid";
import { ZeroInitialization } from "../../lib/initialization/Zero";

// Dataset can be found here: https://www.kaggle.com/competitions/digit-recognizer/overview
// Unzip it and move it to this directory
const trainingSet = readDataSet('./src/solutions/mnist/train.csv');
// const testSet = readDataSet('./src/solutions/mnist/test.csv');

const network = new NeuralNetwork([
  new NetworkLayer({
    inputSize: 784,
    outputSize: 128,
    weightsInitialization: XavierInitialization(784),
    activationLayer: SigmoidActivationLayer
  }),
  new NetworkLayer({
    inputSize: 128,
    outputSize: 10,
    weightsInitialization: ZeroInitialization,
    activationLayer: SigmoidActivationLayer
  })
]);

network.load('mnist');
network.fit(trainingSet.slice(0, 50), 100, 0.1, true);
network.save('mnist');

for (const test of trainingSet.slice(10, 13)) {
  const prediction = network.predict(test.input);
  console.log(`Prediction for ${getHighestIndex(test.expectedOutput)} is ${getHighestIndex(prediction)}`);
}
