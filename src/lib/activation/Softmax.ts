import Matrix from '../Matrix';
import { ActivationLayer } from '../Types';

export const SoftmaxActivationLayer = <ActivationLayer>{

  /**
   * credit: https://gist.github.com/cyphunk/6c255fa05dd30e69f438a930faeb53fe
   */
  feedForward: (input: Matrix) => {
    const biases: number[] = input.getRow(1);
    const maxLogit = Math.max(...biases);
    const scores = biases.map(l => Math.exp(l - maxLogit));
    const denom = scores.reduce((a, b) => a + b);
    const res = new Matrix([scores.map(s => s / denom)]);
    return res;
  },

  backwardPropagation: (outputError: Matrix) => {
    return outputError;
  }

};