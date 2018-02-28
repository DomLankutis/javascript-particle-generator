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
    // Button Daemon
    document.getElementById("buttons").addEventListener("click", function() {handleButtons();});
}

function handleButtons(){
    let DEBUG = document.getElementById("DEBUG");
    let drawOnTop = document.getElementById("drawOnTop");
    let respawn = document.getElementById("respawn");
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

function render(){
    // Particle Master Handler
    master.drawOrigin();

    // Particle Handler
    if (particles.length != 0){
        for (let i = 0; i < particles.length; i++){
            if (particles[i].life == false){
                if(respawn.checked){
                    particles[i] = new Particle();
                }else{ particles.splice(i, 1); } 
            }else{ particles[i].act(); }
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
        this.initialVelocity = Number(document.getElementById("initVelocity").value);
        this.gravity = Number(document.getElementById("Gravity").value);       
        this.acceleration = Number(document.getElementById("Acceleration").value); 
        this.direction = Number(document.getElementById("Direction").value);
        this.generateOutput();
    }

    generateOutput(){
        document.getElementById("Size_D").innerHTML = "  " + this.size;
        document.getElementById("initVelocity_D").innerHTML = "  " + this.initialVelocity ;        
        document.getElementById("Gravity_D").innerHTML = "  " + this.gravity;
        document.getElementById("Acceleration_D").innerHTML = "  " + this.acceleration;
        document.getElementById("Direction_D").innerHTML = "  " + this.direction;
    }

    drawOrigin(){
        rect(this.origin[0], this.origin[1], 10, 10);
    }
}


class Particle{
    constructor(){
        this.t0 = Date.now();        
        this.pos = {
            x: master.origin[0] + 5,
            y: master.origin[1] + 5
        };
        //this.velocity = master.initialVelocity;
        this.velocity = {
            x: abs(master.initialVelocity) * -Math.sin(master.direction),
            y: abs(master.initialVelocity) * Math.cos(master.direction)
        };
    }

    deletaTime(){
        // Returns time in seconds
        return (Date.now() - this.t0) / 1000;
    }

    updateVelocityVal(){
        document.getElementById("velocity_val").innerHTML = this.velocity.y;
    }

    move(){
        /*     
        this.velocity += master.acceleration;
        this.pos.x += this.velocity * -Math.sin(master.direction);
        this.pos.y += (this.velocity * Math.cos(master.direction)) + master.gravity;
        */

        // Forces pushing object forward
        this.velocity.x += master.acceleration * -Math.sin(master.direction);
        this.velocity.y += master.acceleration * Math.cos(master.direction);

        // Repulsive forces
        let airResistence = 0.1
        if (this.velocity.x != 0){
            this.velocity.x += airResistence * -Math.sin(master.direction);
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

    draw(){
        ellipse(this.pos.x, this.pos.y, master.size);

        // DEBUG
        if(DEBUG.checked){
            var x = this.pos.x;
            var y = this.pos.y;
            var sizeOfArrow = 50;
            //Draw line showing direction of particle            
            line(x, y, x + sizeOfArrow * -Math.sin(master.direction), y + sizeOfArrow * Math.cos(master.direction));
        }
    }

    act(){
        this.move();
        this.draw();
        this.updateVelocityVal();
    }
}