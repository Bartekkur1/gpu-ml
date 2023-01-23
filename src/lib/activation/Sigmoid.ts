import Matrix from '../Matrix';
import { ActivationLayer } from '../Types';

const sigmoidValue = (x: number) => {
  return 1 / (1 + Math.exp(-x));
};

const dSigmoidValue = (x: number) => {
  return x * (1 - x);
};

export const SigmoidActivationLayer = <ActivationLayer>{

  feedForward: (input: Matrix) => {
    return input.iterate((x, y) => sigmoidValue(input.getValue(x, y)));
  },

  backwardPropagation: (outputError: Matrix) => {
    return outputError.iterate((x, y) => dSigmoidValue(outputError.getValue(x, y)));
  }
}