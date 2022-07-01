const carCanvas=document.getElementById("carCanvas");
const networkCanvas=document.getElementById("networkCanvas");

carCanvas.width=400;
networkCanvas.width=400;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road (carCanvas.width/2, carCanvas.width * 0.6);   // define the road dimensions
const N=100;
const cars = generateCars(200);                // create an array of N AI cars

let bestCar=cars[0];                        // define best car and set to the first car at the start
if (localStorage.getItem("bestBrain")) {    // if there is a best car saved in the local storage
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -500, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -1000, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -600, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -1200, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -500, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -1000, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -600, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -1200, 30, 50, "DUMMY", getRandomInt(0,4)),
    new Car(road.getLaneCenter(getRandomInt(0,2)), -800, 30, 50, "DUMMY", getRandomInt(0,4))
];

animate();

// define function to save the best car's 'brain' in local storage
function save () {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// define function to remove brain from the local storage
function remove() {
    localStorage.removeItem("bestBrain");
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
    requestAnimationFrame(animate);
}
