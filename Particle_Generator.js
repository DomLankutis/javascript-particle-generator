
let particles = [];
let master;

function setup(){
    frameRate(60);
    createCanvas(720, 480);    
    master = new Particles();
    for (let i = 0; i <= 1; i++){
        particles.push(new Particle());
    }
    // Slider Div Daemon
    document.getElementById("sliders").addEventListener("input", function(){master.updateSliders();});
}

function mouseClicked(){
    if ( (mouseX >= 0 & mouseX <= width) & (mouseY >=0 & mouseY <= height) ){
        master.origin = [mouseX - 5, mouseY - 5];
    }
}

function draw(){
    render();
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
        this.origin = [width / 2 , height / 2];

        //Set min and max of particle direction
        document.getElementById("Direction").max = Math.PI * 2;
        
        this.updateSliders();
    }

    updateSliders(){
        this.size = Number(document.getElementById("Size").value);
        this.gravity = Number(document.getElementById("Gravity").value);       
        this.acceleration = Number(document.getElementById("Acceleration").value); 
        this.direction = Number(document.getElementById("Direction").value);
        this.generateOutput();
    }

    generateOutput(){
        document.getElementById("Size_D").innerHTML = ": " + this.size;
        document.getElementById("Gravity_D").innerHTML = ": " + this.gravity;
        document.getElementById("Acceleration_D").innerHTML = ": " + this.acceleration;
        document.getElementById("Direction_D").innerHTML = ": " + this.direction;
    }

    drawOrigin(){
        rect(this.origin[0], this.origin[1], 10, 10);
    }
}


class Particle{
    constructor(){
        this.t0 = Date.now();        
        this.pos = {
            x: master.origin[0],
            y: master.origin[1]
        };
        this.velocity = 0;
    }

    deletaTime(){
        // Returns time in seconds
        return (Date.now() - this.t0) / 1000;
    }

    updateVelocityVal(){
        document.getElementById("velocity_val").innerHTML = this.velocity;
    }

    move(){
        this.delta = -this.last + (this.last = window.performance.now());
        
        this.velocity += master.acceleration ;
        this.pos.x += this.velocity * -Math.sin(master.direction);
        this.pos.y += (this.velocity  * Math.cos(master.direction)) + master.gravity;
    }

    get life(){
        if (this.pos.x <= 0 | this.pos.y <= 0 | this.pos.x >= width | this.pos.y >= height){
            return false;
        }else { return true; }
    }

    draw(){
        ellipse(this.pos.x, this.pos.y, master.size);

        // DEBUG
        //Draw line showing direction of particle
        let DEBUG = false;
        if(DEBUG){
            var x = this.pos.x;
            var y = this.pos.y;
            var sizeOfArrow = 50;
            line(x, y, x + sizeOfArrow * -Math.sin(master.direction), y + sizeOfArrow * Math.cos(master.direction));
        }
    }

    act(){
        this.move();
        this.draw();
        this.updateVelocityVal();
    }
}