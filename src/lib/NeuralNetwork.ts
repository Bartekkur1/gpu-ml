import { mse } from "./loss/Mse";
import Matrix from "./Matrix";
import { DataSet, Layer } from "./Types";
import { plot } from "asciichart";
import { scaleArray } from "./Util";
import * as fs from 'fs';

import { SingleBar, Presets } from 'cli-progress';

export class NeuralNetwork {
  public layers: Layer[];

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

    const progressBar = new SingleBar({
      format: 'Learning... [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} records'
    }, Presets.shades_classic);
    progressBar.start(dataSet.length * epochs, 0);

    for (let epoch = 1; epoch <= epochs; epoch++) {
      let epochLoss = 0;

      if (flatError) {
        break;
      }

      for (let i = 0; i < dataSet.length; i++) {
        iterations++;

        const { expectedOutput, input } = dataSet[i];
        let output = this.predict(input);

        let mseRes = mse(expectedOutput, output);
        epochLoss += mseRes;

        let outputError = output.sub(expectedOutput);
        for (const layer of this.layers.slice().reverse()) {
          outputError = layer.backwardPropagation(outputError, learningRate);
        }
        progressBar.increment();
      }

      loss.push(epochLoss / dataSet.length);
    }

    progressBar.stop();

    if (debug) {
      console.log(`Flat loss after ${iterations} iterations!`);
      console.log(`Training dataset ${dataSet.length} took ${Date.now() - start}ms`);
      console.log('Loss function:');
      console.log(plot(scaleArray(loss, 100), { height: 20 }));
    }
  }

  public save(name: string) {
    const layersData = this.layers.map(layer => ({
      weights: layer.weights.value,
      biases: layer.biases.value
    }));

    fs.writeFileSync(`./cache/${name}.json`, JSON.stringify(layersData), { encoding: 'utf-8' });
  }

  public load(name: string) {
    if (!fs.existsSync(`./cache/${name}.json`)) {
      console.log('Failed to load neural network cache!');
      return;
    }

    const layersData = JSON.parse(fs.readFileSync(`./cache/${name}.json`, { encoding: "utf-8" }));
    for (let i = 0; i < layersData.length; i++) {
      this.layers[i].weights = new Matrix(layersData[i].weights);
      this.layers[i].biases = new Matrix(layersData[i].biases);
    }
    console.log('Loaded neural network cache!');
  }

}
