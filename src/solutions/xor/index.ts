import { NetworkLayer } from "../../lib/NetworkLayer";
import { NeuralNetwork } from "../../lib/NeuralNetwork";
import { SigmoidActivationLayer } from "../../lib/activation/Sigmoid";
import { XavierInitialization } from "../../lib/initialization/xavier";
import { ZeroInitialization } from "../../lib/initialization/Zero";
import { SimpleLoss } from "../../lib/loss/Sub";
import { CreateSimpleStop } from "../../lib/stop/SimpleStop";
import { dataSet } from "./data";

const network = new NeuralNetwork({
  lossFunction: SimpleLoss,
  stopFunction: CreateSimpleStop(100, 0.01),
  networkCache: 'xor'
}, [
  new NetworkLayer({
    inputSize: 2,
    outputSize: 3,
    activationLayer: SigmoidActivationLayer,
    weightsInitialization: XavierInitialization(3)
  }),
  new NetworkLayer({
    inputSize: 3,
    outputSize: 1,
    activationLayer: SigmoidActivationLayer,
    weightsInitialization: ZeroInitialization
  })
]);

network.fit(dataSet, 100, 0.1, true);

for (let set of dataSet) {
  const { input } = set;
  const prediction = network.predict(input);
  console.log(`Prediction for ${input.value[0]} is ${prediction.value}`);
}
