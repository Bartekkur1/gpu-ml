import { ActivationLayer, Layer, LayerConfiguration } from "./Types";
import { RandomInitialization } from "./initialization/Random";
import Matrix from "./Matrix";

export class NetworkLayer implements Layer {
  public weights: Matrix;
  public biases: Matrix;
  private input: Matrix = new Matrix();
  private output: Matrix = new Matrix();
  private activationLayer: ActivationLayer;

  constructor(config: LayerConfiguration) {
    const initFunc = config.weightsInitialization || RandomInitialization
    this.weights = Matrix.createBySize(config.inputSize, config.outputSize, initFunc);
    this.biases = Matrix.createBySize(1, config.outputSize, initFunc);
    this.activationLayer = config.activationLayer;

  }
  public feedForward(input: Matrix) {
    this.input = input;
    const weightedOutput = input.mul(this.weights).add(this.biases);
    this.output = this.activationLayer.feedForward(weightedOutput);
    return this.output;
  }

  public backwardPropagation(outputError: Matrix, learningRate: number) {
    const gradients = this.activationLayer
      .backwardPropagation(this.output)
      .mulEW(outputError)
      .mul(learningRate);

    const weightsDelta = this.input.transpose().mul(gradients);

    this.weights = this.weights.sub(weightsDelta);
    this.biases = this.biases.sub(gradients);

    return outputError.mul(this.weights.transpose());
  }
}