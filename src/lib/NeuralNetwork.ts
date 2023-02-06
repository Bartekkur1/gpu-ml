import { mse } from "./loss/Mse";
import Matrix from "./Matrix";
import { DataSet, Layer, NeuralNetworkConfiguration } from "./Types";
import * as fs from 'fs';

export class NeuralNetwork {
  public layers: Layer[];
  private configuration: NeuralNetworkConfiguration;

  constructor(configuration: NeuralNetworkConfiguration, layers?: Layer[]) {
    this.configuration = configuration;
    this.layers = layers || [];

    if (this.configuration.networkCache) {
      this.load(this.configuration.networkCache);
    }
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
    const start = Date.now();

    let prevMeanLoss = 0;
    for (let epoch = 1; epoch <= epochs; epoch++) {
      let epochStart = Date.now();
      let epochLoss = 0;
      for (let i = 0; i < dataSet.length; i++) {

        const { expectedOutput, input } = dataSet[i];
        let output = this.predict(input);

        let mseRes = mse(expectedOutput, output);
        epochLoss += mseRes;

        let outputError = this.configuration.lossFunction(output, expectedOutput);
        for (const layer of this.layers.slice().reverse()) {
          outputError = layer.backwardPropagation(outputError, learningRate);
        }
      }

      const meanLoss = epochLoss / dataSet.length;
      console.log(`Epoch ${epoch} \t mean loss: ${meanLoss} \t improvement: ${meanLoss - prevMeanLoss} \t time: ${Date.now() - epochStart}`);
      prevMeanLoss = meanLoss;
      if (this.configuration.stopFunction && this.configuration.stopFunction(epoch, meanLoss)) {
        console.log('Flat loss found');
        break;
      }
    }

    console.log(`Training dataset ${dataSet.length} over ${epochs} epochs took ${Date.now() - start}ms`);
    if (this.configuration.networkCache) {
      this.save(this.configuration.networkCache);
    }
  }

  private save(name: string) {
    const layersData = this.layers.map(layer => ({
      weights: layer.weights.value,
      biases: layer.biases.value
    }));

    fs.writeFileSync(`./cache/${name}.json`, JSON.stringify(layersData), { encoding: 'utf-8' });
  }

  private load(name: string) {
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
