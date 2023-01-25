import Matrix from '../Matrix';
import { ActivationLayer } from '../Types';

export const LinearActivationLayer = <ActivationLayer>{

  feedForward: (input: Matrix) => {
    return input;
  },

  backwardPropagation: (outputError: Matrix) => {
    return outputError;
  }
}