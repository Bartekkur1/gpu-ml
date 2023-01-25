import Matrix from '../Matrix';
import { ActivationLayer } from '../Types';

export const ReluActivationLayer = <ActivationLayer>{

  feedForward: (input: Matrix) => {
    return input.iterate((x, y) => Math.max(0, input.getValue(x, y)));
  },

  backwardPropagation: (outputError: Matrix) => {
    return outputError.iterate((x, y) => outputError.getValue(x, y) > 0 ? 1 : 0);
  }
}