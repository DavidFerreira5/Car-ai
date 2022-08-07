const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const ttl = 20000
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const N = 100
let cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0;i<cars.lengt;i++){
        car.brain = JSON.parse(
        localStorage.getItem("bestBrain")
        );
        NeuralNetwork.mutate(cars[i].brain,0.1);
    }
}

const trafficRows = 4
let traffic = []

animate()

//to save a car in local storage
function saveCar(){
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain)
    )
    localStorage.setItem(
        "bestScore",
        JSON.stringify(bestCar.score)
    )
}

//to remove the current car from local storage
function removeCar(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("bestScore");
}

function assiningRandomTrafic(rows){
    traffic = [];
    let i = 1;

    while(i!=rows+1){
        traffic.push(new Car(road.getLaneCenter(getRandomInt(0,road.laneCount)),-200*i,20,50,"DUMMY",2));
        traffic.push(new Car(road.getLaneCenter(getRandomInt(0,road.laneCount)),-200*i,20,50,"DUMMY",2));
        i++
    }
}

assiningRandomTrafic(trafficRows)

function generateCars(n){
    const cars = [];
    for(let i = 0;i<n;i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    if(Math.floor(time)%ttl < 50){
        const carToBeat = localStorage.getItem("bestScore")
        if(carToBeat == null || bestCar.score>carToBeat){
            console.log("New Best:" + bestCar.score)
            saveCar();
        }    
        cars = generateCars(N);
        for(let i = 0;i<cars.lengt;i++){
            car.brain = JSON.parse(
            localStorage.getItem("bestBrain")
            );
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
        assiningRandomTrafic(trafficRows)
    }

    for(let i = 0; i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    bestCar = cars[0];
    cars.forEach(car=>{
        car.update(road.borders,traffic)
        if(car.y<bestCar.y){
            bestCar = car;
        }
    });

    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight

    carCtx.save();
    carCtx.translate(0,-bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0; i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 0.2;
    cars.forEach(car=>{car.draw(carCtx,"blue")});
    carCtx.globalAlpha = 1;
    cars[0].draw(carCtx,"blue",true)

    carCtx.restore();

    networkCtx.lineDashOffset = -time;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}