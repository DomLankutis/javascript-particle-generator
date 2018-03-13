/// <reference path="./p5.global-mode.d.ts"/>

let particles = [];
let usedSections;
let master;

function setup(){
    frameRate(60);
    createCanvas(1280, 720);
    master = new Particles();  
    for (let i = 0; i <= 100; i++){
        particles.push(new Particle());
    }
    // Slider Div Daemon
    document.getElementById("sliders").addEventListener("input", function(){master.updateSliders();});
    // Button Daemon
    document.getElementById("buttons").addEventListener("click", function() {handleButtons();});
}

function handleButtons(){
    let DEBUG = document.getElementById("DEBUG");
    let drawOnTop = document.getElementById("drawOnTop");
    let respawn = document.getElementById("respawn");
    let randColours = document.getElementById("randColours");
}

function mouseClicked(){
    if ( (mouseX >= 0 & mouseX <= width) & (mouseY >=0 & mouseY <= height) ){
        master.origin = [mouseX - 5, mouseY - 5];
    }
}

function draw(){
    if(!drawOnTop.checked){
        clear();
    }
    render();
}

function checkCollisions(keys){
    for (let i = 0; i < keys.length; i++){
        if (usedSections[keys[i]].length > 1){
            let grid = usedSections[keys[i]]
            for (let p1 = 0; p1 < grid.length; p1++){
                for (let p2 = 0; p2 < grid.length; p2++){
                    let pa1 = particles[grid[p1][2]]
                    let pa2 = particles[grid[p2][2]]
                    let distance = dist(pa1.pos.x, pa1.pos.y, pa2.pos.x, pa2.pos.y)
                    if (distance <= master.size){
                        let gridName = String("Grid" + Math.floor(pa1.pos.x / master.gridSize) + Math.floor(pa1.pos.y / master.gridSize))
                        try{
                            fill(255)
                            rect(master.collisionGrid[gridName][0], master.collisionGrid[gridName][1], master.gridSize, master.gridSize)
                        }                            
                        finally{
                            continue
                        }
                    }
                }
            }
        }
    }
}

function render(){
    let keys
    // Particle Master Handler
    master.drawOrigin();
    //master.drawGrid();              
    usedSections = {};
    // Particle Handler
    if (particles.length != 0){
        for (let i = 0; i < particles.length; i++){
            if (particles[i].life == false){
                if(respawn.checked){
                    particles[i] = new Particle();
                }else{ particles.splice(i, 1); } 
            }else{ particles[i].act(); }
        
            let gridName = String("Grid" + Math.floor(particles[i].pos.x / master.gridSize) + Math.floor(particles[i].pos.y / master.gridSize))
            let gridpos = master.collisionGrid[gridName];
            keys = Object.keys(usedSections);
            // Data stored as [Xpos, Ypos, partilceIndex]
            if (keys.indexOf(gridName) > -1){
                usedSections[gridName].push([particles[i].pos.x, particles[i].pos.y, i]);
            }else{
                usedSections[gridName] = [[particles[i].pos.x, particles[i].pos.y, i]];
            }
        }
        let sizeOfArrow = 50;
        line(master.origin[0] + 5, master.origin[1] + 5, master.origin[0] + 5 + sizeOfArrow * -Math.sin(master.direction + master.span / 2), master.origin[1] + 5 + sizeOfArrow * Math.cos(master.direction + master.span / 2));
        line(master.origin[0] + 5, master.origin[1] + 5, master.origin[0] + 5 + sizeOfArrow * -Math.sin(master.direction - master.span / 2), master.origin[1] + 5 + sizeOfArrow * Math.cos(master.direction - master.span / 2));        
    }
    checkCollisions(keys)
}

function randomRange(max, min = 0){
    return Math.floor(Math.random() * (max + 1  - min) + min);
}


class Particles{
    constructor(){
        this.origin = [width / 2 , height / 2];
        this.gridSize = 75;
        this.createGrid();

        //Set min and max of particle direction
        document.getElementById("Direction").max = Math.PI * 2;
        
        this.updateSliders();
    }

    updateSliders(){
        this.size = Number(document.getElementById("Size").value);
        this.initialVelocity = Number(document.getElementById("initVelocity").value);
        this.gravity = Number(document.getElementById("Gravity").value);       
        this.acceleration = Number(document.getElementById("Acceleration").value); 
        this.direction = Number(document.getElementById("Direction").value);
        this.span = Number(document.getElementById("Span").value);        
        this.generateOutput();
    }

    generateOutput(){
        document.getElementById("Size_D").innerHTML = "  " + this.size;
        document.getElementById("initVelocity_D").innerHTML = "  " + this.initialVelocity ;        
        document.getElementById("Gravity_D").innerHTML = "  " + this.gravity;
        document.getElementById("Acceleration_D").innerHTML = "  " + this.acceleration;
        document.getElementById("Direction_D").innerHTML = "  " + this.direction;
        document.getElementById("Span_D").innerHTML = "  " + this.span / 2;
    }

    drawOrigin(){
        rect(this.origin[0], this.origin[1], 10, 10);
    }

    drawGrid(){
        for (let grid in Object.entries(this.collisionGrid)){
            let gridpos = Object.entries(this.collisionGrid)[grid][1];
            stroke(0);
            line(gridpos[0], 0, gridpos[0], height);
            line(0, gridpos[1], width, gridpos[1]);
        }
    }

    createGrid(){
        this.collisionGrid = {};
        for (let w = 0; w <= width; w += this.gridSize){
            for (let h = 0; h <= height; h += this.gridSize){
                this.collisionGrid["Grid" + (w / this.gridSize) + (h / this.gridSize)] = [w, h];
            }
        }
    }
}

            
class Particle{
    constructor(){
        this.t0 = Date.now();
        this.direction = master.direction + (Math.random() * master.span) - master.span / 2; // Some randomisation to the general direction   
        this.pos = {
            x: master.origin[0] + 5,
            y: master.origin[1] + 5
        };
        this.velocity = {
            x: abs(master.initialVelocity) * -Math.sin(this.direction),
            y: abs(master.initialVelocity) * Math.cos(this.direction)
        };
        this.colours = {
            r: randomRange(255),
            g: randomRange(255),
            b: randomRange(255)
        };
        this.colour = color(this.colours.r, this.colours.g, this.colours.b);
        
    }

    updateVelocityVal(){
        document.getElementById("velocity_val").innerHTML = this.velocity.y;
    }

    move(){
        // Forces pushing object forward
        this.velocity.x += master.acceleration * -Math.sin(this.direction);
        this.velocity.y += master.acceleration * Math.cos(this.direction);

        // Repulsive forces
        let airResistence = 0.1;
        if (this.velocity.x != 0){
            this.velocity.x += airResistence * -Math.sin(this.direction);
        }
        this.velocity.y += -master.gravity * Math.cos(90);

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;

    }

    get life(){
        if (this.pos.x <= 0 | this.pos.y <= 0 | this.pos.x >= width | this.pos.y >= height){
            return false;
        }else { return true; }
    }

    setcolour(){
        if (randColours.checked){
            let max = 75;
            this.colours.r += randomRange(max, -max);
            this.colours.g += randomRange(max, -max);
            this.colours.b += randomRange(max, -max);
            this.colour = color(this.colours.r, this.colours.g, this.colours.b);        
        }
        fill(this.colour);        
    }

    draw(){
        noStroke();
        this.setcolour();
        ellipse(this.pos.x, this.pos.y, master.size);

        // DEBUG
        if(DEBUG.checked){
            var x = this.pos.x;
            var y = this.pos.y;
            var sizeOfArrow = 50;
            //Draw line showing direction of particle   
            line(x, y, x + sizeOfArrow * -Math.sin(this.direction), y + sizeOfArrow * Math.cos(this.direction));
        }
    }

    act(){
        this.move();
        this.draw();
        this.updateVelocityVal();
    }
}