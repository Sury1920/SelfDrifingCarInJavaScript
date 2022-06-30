const carCanvas=document.getElementById("carCanvas");
const networkCanvas=document.getElementById("networkCanvas");

carCanvas.width=400;
networkCanvas.width=400;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road (carCanvas.width/2, carCanvas.width * 0.6);
const N=100;
const cars = generateCars(N);

const traffic=[
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3)
];

animate();

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

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    carCtx.save(); //save context
    carCtx.translate(0,-cars[0].y + carCanvas.height*0.7); // move 'camera' with the car
    
    road.draw(carCtx); //draw road lanes
    
    for (let i = 0; i < traffic.length; i++) {          // draw other vehicles
        traffic[i].draw(carCtx, "blue");        
    }

    carCtx.globalAlpha=0.2;                             // set opacity for the cars
    for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "red");                        // draw the AI cars
    }
    carCtx.globalAlpha=1;                               //bring back opacity to max
    cars[0].draw(carCtx, "red", true);
    
    arCtx.restore(); // restore context

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, cars[0].brain);  //use external library to visualise the network
    requestAnimationFrame(animate);
}
