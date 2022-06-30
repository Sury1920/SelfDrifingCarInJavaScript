class NeuralNetwork {
    constructor (neuronCounts){                                 // construct neural network using an Array specifying number of neurons in each layer
        this.levels=[];                                         // neural network is an array of levels
        for (let i = 0; i < neuronCounts.length-1; i++) {       // for each layer
            this.levels.push(new Level(                         // create a level and push onto levels array
                neuronCounts[i], neuronCounts[i+1]              // that will have input size of neuronCounts[i] and output size of neuronCounts[i+1]
            ));
        }
    }
    static feedForward(givenInputs, network) {                  // given inputs and a network
        let outputs=Level.feedForward(                          // get the outputs
            givenInputs, network.levels[0]);                    // by calling the first level
        for (let i = 1; i < network.levels.length; i++) {       // loop through remaining levels
            outputs=Level.feedForward(                          // and get the outputs
                outputs, network.levels[i]);                    // for each network level
        }
        return outputs;
    }

}



class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);                    // Array of inputs
        this.output = new Array (outputCount);                  // Array of outputs
        this.biases = new Array (outputCount);                  // Array of biases

        this.weights=[]; // Array of weights
        for (let i=0; i<inputCount; i++) {
            this.weights[i]=new Array(outputCount);             // Array of arrays | input to all outputs
        }
        Level.#randomize(this);                                 // Call randomize function
    }
    static #randomize(level) { 
        // pick random weights
        for(let i=0; i<level.inputs.length;i++) {
            for (let j = 0; j < level.outputs.length; j++) {    // for each input-output pair in given level
                level.weights[i][j]=Math.random()*2-1;          // assign weight value between -1 and 1
            }
        }
        // pick random biases
        for (let i=0; i<level.biases.lenght; i++) {             // for each output in given level...
            level.biases[i]=Math.random()*2-1;                  // assign bias value between -1 and 1
        }
    }

    static feedForward(givenInputs, level) {                    // using feed-forward algorithm
        for (let i = 0; i < level.inputs.length; i++) {         // for each input
            level.inputs[i]=givenInputs[i];                     // assign value from the car sensors
        }
        for (let i = 0; i < level.output.length; i++) {         // for each output
            let sum = 0;                                        // 1.   calculate sum
            for (let j = 0; j < level.input.length; j++) {      //      consisting of
                sum+=level.input[j]*level.weights[j][i];        //      each input value * weight of each input-output pair
            }
            if(sum>level.biases[i]) {                           // 2.   check if sum is greater than this output's bias value
                level.outputs[i]=1;                             //      if so - activate the output
            } else {
                level.outputs[i]=0;                             //      else - don't activate it
            }
        }    
    }


}