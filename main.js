const carCanvas=document.getElementById("carCanvas");
const networkCanvas=document.getElementById("networkCanvas");

carCanvas.width=400;
networkCanvas.width=400;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.6);   // define the road dimensions

let currentGeneration = 0;
let bestDistance = 0;

function decide(value){ //onclick function for both decision buttons (they send value 'train'/'test' as argument)
    startApp(value);
}

function startApp(mode) {

    console.log('start')
    //changing the view
    document.getElementById('inGameButtons').style.display = "flex";
    document.getElementById('divCanvas').style.display = "flex";
    // document.getElementById('divShowData').style.display = "block";

    //setting onclick functions for new buttons
    document.getElementById('buttonSaveCar').onclick = saveCar; //saves the car you are currently focused on as new 'bestBrain'
    document.getElementById('buttonRemoveCar').onclick = removeCar; //removes current 'bestBrain'



    // GENERATE N NUMBER OF AI CARS
    let N=500;

    const cars = generateCars(N);                // create an array of N AI cars
    let traffic=[];

    //add details to textarea
    addToDetails(`${mode} Epoch: ${currentGeneration} \n\n`);
    addToDetails(`Best Distance: ${Math.floor(-bestDistance)} \n\n`);
    addToDetails(`Current best Brain: \n\n ${localStorage.getItem("bestBrain")} \n\n------------------------------------------\n\n`);

    let bestCar=cars[0];                        // define best car and set to the first car at the start
    if (localStorage.getItem("bestBrain")) {    // if there is a best car saved in the local storage
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            
            // MUTATE THE NETWORK
                if (i!=0) {
                NeuralNetwork.mutate(cars[i].brain, 0.7 - (currentGeneration * 0.02)); // <- value to tweak similarity of cars' brains
            }
        }
    }

    // CONTROLL THE TRAFFIC

    if (mode=="train") // IF USING TRAINING MODE
    {
        console.log("train")
        traffic=[
            new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
            new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 4),
            new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
            new Car(road.getLaneCenter(1), 200, 30, 50, "DUMMY", 6),
            new Car(road.getLaneCenter(1), 800, 30, 50, "DUMMY", 6),
            new Car(road.getLaneCenter(2), 300, 30, 50, "DUMMY", 6),
            new Car(road.getLaneCenter(0), 500, 30, 50, "DUMMY", 6),
            new Car(road.getLaneCenter(2), -600, 30, 50, "DUMMY", 1),
            new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 3)
        ];
    }
    else // IF USING TEST MODE
    {
        randomVehicleCount = 24;
        traffic=[];
        for (let i = 0; i < randomVehicleCount/2; i++) {
            randomVehicleBehind = new Car(road.getLaneCenter(getRandomInt(0,2)), getRandomInt(200,800)*(randomVehicleCount/6), 30, 50, "DUMMY", 6);
            randomVehicleInFront = new Car(road.getLaneCenter(getRandomInt(0,2)), getRandomInt(-100,-1400), 30, 50, "DUMMY", getRandomInt(0,4));
            traffic.push(randomVehicleBehind);
            traffic.push(randomVehicleInFront);
        }
    }
    animate();


    // FUNCTION DEFINITIONS

    // define function to save the best car's 'brain' in local storage
    function saveCar () {
        localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    }
    
    // define function to remove brain from the local storage
    function removeCar () {
        localStorage.removeItem("bestBrain");
        currentGeneration = 0;
        bestDistance = 0;
        startApp("train")
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateCars(N) {
        const cars=[];
        for (let i = 0; i < N; i++) {
            cars.push(new Car(road.getLaneCenter(1),100,30,50, "AI"));
        }
        return cars;
    }

    function animate(time) {
        for (let i = 0; i < traffic.length; i++) {
            traffic[i].update(road.borders,[]);        
        }
        for (let i = 0; i < cars.length; i++) {
            cars[i].update(road.borders, traffic);
        }


        // FITNESS FUNCTION -- to play around with
        bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y))); // define best car as the one with lowest y value
        

        if(cars.filter(car=> car.damaged).length == cars.length){
            currentGeneration += 1;
            let tempBest = bestCar.y
            console.log(bestCar.y)
            console.log(tempBest)
            console.log(bestDistance)
            console.log(tempBest > bestDistance)
            if(tempBest < bestDistance) bestDistance = tempBest;
            console.log(bestDistance)
            saveCar();
            startApp(mode)
        }

        carCanvas.height=window.innerHeight;
        networkCanvas.height=window.innerHeight;
        
        carCtx.save(); //save context
        carCtx.translate(0,-bestCar.y + carCanvas.height*0.7); // move 'camera' with the car
        
        road.draw(carCtx); //draw road lanes
        
        for (let i = 0; i < traffic.length; i++) {          // draw other vehicles
            traffic[i].draw(carCtx, "blue");        
        }

        carCtx.globalAlpha=0.2;                             // set opacity for the cars
        for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "red");                        // draw the AI cars
        }
        carCtx.globalAlpha=1;                               //bring back opacity to max
        bestCar.draw(carCtx, "red", true);
        
        carCtx.restore(); // restore context

        networkCtx.lineDashOffset=-time/50;
        Visualizer.drawNetwork(networkCtx, bestCar.brain);  //use external library to visualise the network
        if(cars.filter(car=> car.damaged).length !== cars.length) requestAnimationFrame(animate);
    }
}

function showDetails(){
    document.getElementById('divShowData').style.display = document.getElementById('divShowData').style.display == '' ?  'block' : '';
}

function addToDetails(value){
    document.getElementById('textData').value += value;
}
