import Matrix from '../Matrix';
import { ActivationLayer } from '../Types';

export const TanhActivationLayer = <ActivationLayer>{

  feedForward: (input: Matrix) => {
    return input.iterate((x, y) => Math.tanh(input.getValue(x, y)));
  },

  backwardPropagation: (outputError: Matrix) => {
    return outputError.iterate((x, y) => 1 - Math.pow(Math.tanh(outputError.getValue(x, y)), 2));
  }
}