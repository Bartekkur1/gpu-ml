import { mse } from "./loss/Mse";
import Matrix from "./Matrix";
import { DataSet, Layer } from "./Types";
import { plot } from "asciichart";
import { scaleArray } from "./Util";

export class NeuralNetwork {
  private layers: Layer[];

  constructor(layers?: Layer[]) {
    this.layers = layers || [];
  }

  public addLayer(layer: Layer) {
    this.layers.push(layer);
    return this;
  }

  public addLayers(layers: Layer[]) {
    this.layers.push(...layers);
  }

  public predict(sample: Matrix): Matrix {
    let output = sample
    for (const layer of this.layers) {
      output = layer.feedForward(output);
    }
    return output;
  }

  public fit(dataSet: DataSet[], epochs: number, learningRate: number, debug: boolean = false) {
    const loss = [];
    const start = Date.now();
    let flatError = false;
    let iterations = 0;
    for (let epoch = 1; epoch <= epochs; epoch++) {
      iterations++;
      if (flatError) {
        break;
      }
      let mseRes = 0;
      for (let i = 0; i < dataSet.length; i++) {
        const { expectedOutput, input } = dataSet[i];
        let output = this.predict(input);

        mseRes += mse(expectedOutput, output);

        let outputError = output.sub(expectedOutput);
        for (const layer of this.layers.slice().reverse()) {
          outputError = layer.backwardPropagation(outputError, learningRate);
        }
      }
      const lossToSize = mseRes / dataSet.length;
      loss.push(lossToSize);
      if (lossToSize <= 0.005) {
        flatError = true;
      }
    }

    if (debug) {
      console.log(`Flat loss after ${iterations} iterations!`);
      console.log(`Training dataset ${dataSet.length} took ${Date.now() - start}ms`);
      console.log('Loss function:');
      console.log(plot(scaleArray(loss, 100), { height: 20 }));
    }
  }
}
