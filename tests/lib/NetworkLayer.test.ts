import Matrix from '../../src/lib/Matrix';
import { NetworkLayer } from '../../src/lib/NetworkLayer';
import { SigmoidActivationLayer } from '../../src/lib/activation/Sigmoid';

describe('Network Layer class tests', () => {

  test('Should be initialized with given size', () => {
    const layer = new NetworkLayer(2, 3, SigmoidActivationLayer);

    expect(layer.weights.size).toStrictEqual({
      rows: 2,
      cols: 3,
      size: 6
    });

    expect(layer.biases.size).toStrictEqual({
      rows: 1,
      cols: 3,
      size: 3
    });
  });

  test('Feedforward should multiply input times weight, add biases and pass values through activation function', () => {
    const layer = new NetworkLayer(1, 2, SigmoidActivationLayer);
    // override default random generated values
    layer.weights = Matrix.createBySize(1, 2, () => 2);
    layer.biases = Matrix.createBySize(1, 2, () => -4);

    const res = layer.feedForward(new Matrix([[2]]));
    expect(res.value).toStrictEqual([[0.5, 0.5]]);
  });

});