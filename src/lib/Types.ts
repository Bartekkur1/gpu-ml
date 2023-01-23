import Matrix from "./Matrix";

export interface LayerConfiguration {
  inputSize: number;
  outputSize: number;
  activationLayer: ActivationLayer;
  weightsInitialization: () => number;
}

export interface Layer {
  feedForward: (input: Matrix) => Matrix;
  backwardPropagation: (outputError: Matrix, learningRate: number) => Matrix;
}

export interface ActivationLayer {
  feedForward: (input: Matrix) => Matrix;
  backwardPropagation: (input: Matrix) => Matrix;
}

export interface DataSet {
  input: Matrix;
  expectedInput: Matrix;
}