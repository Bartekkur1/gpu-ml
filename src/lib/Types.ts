import Matrix from "./Matrix";

export interface LayerConfiguration {
  inputSize: number;
  outputSize: number;
  activationLayer: ActivationLayer;
  weightsInitialization?: () => number;
}

export interface Layer {
  weights: Matrix;
  biases: Matrix;
  feedForward: (input: Matrix) => Matrix;
  backwardPropagation: (outputError: Matrix, learningRate: number) => Matrix;
}

export interface ActivationLayer {
  feedForward: (input: Matrix) => Matrix;
  backwardPropagation: (input: Matrix) => Matrix;
}

export interface DataSet {
  input: Matrix;
  expectedOutput: Matrix;
}

export type LossFunction = (output: Matrix, expectedOutput: Matrix) => Matrix;

export interface NeuralNetworkConfiguration {
  lossFunction: LossFunction;
  stopFunction?: StopFunction;
  networkCache?: string;
}

export type StopFunction = (epoch: number, loss: number) => boolean;