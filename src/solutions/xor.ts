import { NetworkLayer } from "../lib/NetworkLayer";
import { NeuralNetwork } from "../lib/NeuralNetwork";
import Matrix from "../lib/Matrix";
import { TanhActivationLayer } from "../lib/activation/Tanh";
// import { SigmoidActivationLayer } from "../lib/activation/Sigmoid";
import { DataSet } from "../lib/Types";
import { XavierInitialization } from "../lib/initialization/xavier";
import GpuMath from "../lib/GpuMath";

const activationLayer = TanhActivationLayer;
// const activationLayer = SigmoidActivationLayer;

const gpuMath = new GpuMath();
const network = new NeuralNetwork([
  new NetworkLayer(gpuMath, {
    inputSize: 2,
    outputSize: 3,
    activationLayer,
    weightsInitialization: XavierInitialization(2)
  }),
  new NetworkLayer(gpuMath, {
    inputSize: 3,
    outputSize: 1,
    activationLayer,
    weightsInitialization: XavierInitialization(3)
  })
]);

const dataSet: DataSet[] = [
  {
    input: new Matrix([[0, 0]]),
    expectedOutput: new Matrix([[0]])
  },
  {
    input: new Matrix([[1, 0]]),
    expectedOutput: new Matrix([[1]])
  },
  {
    input: new Matrix([[0, 1]]),
    expectedOutput: new Matrix([[1]])
  },
  {
    input: new Matrix([[1, 1]]),
    expectedOutput: new Matrix([[0]])
  },
]

network.fit(dataSet, 10000, 0.1, true);

for (let set of dataSet) {
  const { input } = set;
  const prediction = network.predict(input);
  console.log(`Prediction for ${input.value[0]} is ${prediction.value}`);
}
