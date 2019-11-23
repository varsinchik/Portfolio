
var canvas  = document.getElementById("anime");
var C = canvas.getContext("2d");
var divKvadrat = document.getElementsByClassName("kvadrat");
canvas.width = innerWidth;
canvas.height = innerHeight;

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}

function resolvecollision (circle, otherCircle){
    const  xVelocity = circle.velocity.x - otherCircle.velocity.x;
    const  yVelocity = circle.velocity.y - otherCircle.velocity.y;

    const  xDist = otherCircle.x - circle.x;
    const  yDist = otherCircle.y - circle.y;


    if(xVelocity * xDist + yVelocity * yDist >=0){

        const angle = -Math.atan2(otherCircle.y - circle.y, otherCircle.x - circle.x);
        
        const m1 = circle.mass;
        const m2 = otherCircle.mass;

        const u1 = rotate(circle.velocity, angle);
        const u2 = rotate(otherCircle.velocity, angle);

        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        circle.velocity.x = vFinal1.x;
        circle.velocity.y = vFinal1.y;

        otherCircle.velocity.x = vFinal2.x;
        otherCircle.velocity.y = vFinal2.y;

    }

}

function Circle(x,y){

    this.x = x;
    this.y = y;
    var size = getRandomInRange(0.08 ,1.7);
    this.velocity = {
        y: getRandomInRange(-0.09, 0.09),
        x: getRandomInRange(-0.09, 0.09)
    };
    this.mass = 1;

    this.update = function(){
        if(this.x > (canvas.width- 5)  || this.x - 5 < 0){
            this.velocity.x = -this.velocity.x;
        }
        
        if(this.y > (canvas.height - 5) || this.y - 5 < 0){
            this.velocity.y = -this.velocity.y; 
        }

        function distance (x1, y1, x2, y2){
            let xDist = x2 - x1;
            let yDist = y2 - y1;
        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        }

        


        for(var i = 0; i < circleArray.length; i++){

            if (this === circleArray[i]) continue;

            if (distance(this.x, this.y, circleArray[i].x, circleArray[i].y) - 4 < 0){
                resolvecollision (this, circleArray[i]);    
            }

        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;   

        this.draw();

    };

    this.draw = function(){                  
        C.beginPath();
        C.arc( this.x , this.y, size, 0, Math.PI * 2, false);
        C.fillStyle = "white";    
        C.fill();
        C.closePath();
    };
}

var circleArray = [];

for(var i=0; i<2000; i++){
    var   x = getRandomInRange(10 ,(canvas.width- 10));
    var   y = getRandomInRange(10, (canvas.height - 10)); 
    circleArray.push(new Circle( x, y));
}

function prostoVpravo(){
    
    requestAnimationFrame(prostoVpravo);
    C.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < circleArray.length; i++){
        
        circleArray[i].update();
    }

}

prostoVpravo();