import GpuMath from "./GpuMath";
import Matrix from "./Matrix";
import { ActivationLayer, Layer, LayerConfiguration } from "./Types";

export class NetworkLayer implements Layer {
  public weights: Matrix;
  public biases: Matrix;
  private input: Matrix = new Matrix();
  private output: Matrix = new Matrix();
  private activationLayer: ActivationLayer;
  private gpu: GpuMath;

  constructor(gpu: GpuMath, config: LayerConfiguration) {
    this.gpu = gpu;
    if (config.weightsInitialization) {
      this.weights = Matrix.createBySize(config.inputSize, config.outputSize, config.weightsInitialization);
      this.biases = Matrix.createBySize(1, config.outputSize, config.weightsInitialization);
    } else {
      this.weights = Matrix.createRandom(config.inputSize, config.outputSize);
      this.biases = Matrix.createRandom(1, config.outputSize);
    }
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