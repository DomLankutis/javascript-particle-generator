"use strict";

let particles = [];
let master;

function setup(){
    frameRate(60);
    createCanvas(720, 480);    
    master = new Particles();
    // Slider Div Daemon
    document.getElementById("sliders").addEventListener("input", function(){master.updateSliders()});
    for (let i = 0; i <= 1; i++){
        particles.push(new Particle());
    }
}

function mouseClicked(){
    if ( (mouseX >= 0 & mouseX <= width) & (mouseY >=0 & mouseY <= height) ){
        master.origin = [mouseX - 5, mouseY - 5];
    }
}

function draw(){
    render();
}

let points = []

function passf(val){
    return val;
}
function render(){

    // Particle Master Handler
    master.drawOrigin();

    // Particle Handler
    if (particles.length != 0){
        for (let i = 0; i < particles.length; i++){
            if (particles[i].life == false){
                particles.splice(i, 1);
            }else{
                particles[i].act();
            }
        }
    }
}


class Particles{
    constructor(){
        this.origin = [width / 8 , height / 1.2];
        // On sliders change update them
        this.updateSliders();
    }

    updateSliders(){
        this.size = Number(document.getElementById("Size").value)
        this.gravity = Number(document.getElementById("Gravity").value);       
        this.acceleration = Number(document.getElementById("Acceleration").value) 
        this.velocity = Number(document.getElementById("Velocity").value)
        this.direction = Number(document.getElementById("Direction").value)
        this.generateOutput()
    }

    generateOutput(){
        document.getElementById("Size_D").innerHTML = ": " + this.size;
        document.getElementById("Gravity_D").innerHTML = ": " + this.gravity;
        document.getElementById("Acceleration_D").innerHTML = ": " + this.acceleration;
        document.getElementById("Velocity_D").innerHTML = ": " + this.velocity;
        document.getElementById("Direction_D").innerHTML = ": " + this.direction;
    }

    drawOrigin(){
        rect(this.origin[0], this.origin[1], 10, 10);
    }
}


class Particle{
    constructor(){
        this.last = window.performance.now();
        this.delta;
        this.pos = {
            x: master.origin[0],
            y: master.origin[1]
        };
    }

    move(){
        this.delta = -this.last + (this.last = window.performance.now());
        
        master.velocity += master.acceleration ;
        this.pos.x += master.velocity * Math.sin(master.direction) ;
        this.pos.y += (master.velocity) * Math.cos(master.direction) * master.gravity ;
    }

    get life(){
        if (this.pos.x <= 0 | this.pos.y <= 0 | this.pos.x >= width | this.pos.y >= height){
            return false;
        }else { return true; }
    }

    draw(){
        ellipse(this.pos.x, this.pos.y, master.size);
    }

    act(){
        this.move();
        this.draw();
    }
}