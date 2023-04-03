window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    ship = particle.create(width/2, height/2, 0, 0,0),
    thrush = vector.create(0, 0),
    backward = vector.create(0, 0),
    angle = 0,
    turningLeft = false,
    turningRight = false,
    thrusting = false,
    bullets = [],
    back = false,
    fire = false;

    update();

    document.body.addEventListener("keydown", function(event){
        console.log(event.keyCode);
        switch (event.keyCode){
            case 38: // up
                thrusting = true;
                break;
            case 37: // left
                turningLeft = true;
                break;
            case 39: // right
                turningRight = true;
                break;
            case 40: // back
                back = true;
                break;
            case 32:
                fire = true;
                break;
            default:
                break;
        }
    });

    document.body.addEventListener("keyup", function(event){
        // console.log(event.keyCode);
        switch (event.keyCode){
            case 38: // up
                thrusting = false;
                break;
            case 37: // left
                turningLeft = false;
                break;
            case 39: // right
                turningRight = false;
                break;
            case 40: // back
                back = false;
                break;
            case 32:
                fire = false;
                break;
            default:
                break;
        }
    });
    
    function update(){
        context.clearRect(0, 0, width, height);
        
        if (turningLeft){
            angle -= 0.05;
        }
        if (turningRight){
            angle += 0.05;
        }
        backward.setAngle(angle);
        thrush.setAngle(angle);
        if (thrusting){
            thrush.setLength(0.1);
        }else{
            thrush.setLength(0);
        }

        if (back){
            backward.setLength(-0.1);
        }else{
            backward.setLength(0);
        }

        ship.accelerate(thrush.add(backward));
        ship.update();
        context.save();
        context.translate(ship.position.getX(), ship.position.getY());
        context.rotate(angle);

        context.beginPath();
        context.moveTo(10, 0);
        context.lineTo(-10, -7);
        context.lineTo(-10, 7);
        context.lineTo(10, 0);
        context.moveTo(10, 0);
        context.lineTo(10 + Math.cos(angle)*20, 0+ Math.sin(angle)*20);
        if (thrusting){
            context.moveTo(-10, 0);
            context.lineTo(-18, 0);
        }
        context.stroke();
        context.arc(0, 0, 2, 0, 2* Math.PI, false);
        context.fill();
        context.restore();

        if (fire){
            // context.moveTo(10, 0);
            // context.lineTo(100, 0);
            bullets.push(bullet.create(ship.position.getX(), ship.position.getY(), 2.5, angle));
        }

        if (bullets != []){
            bullets.map((b)=>{
                b.update()
                context.beginPath();
                context.arc(b.position.getX(), b.position.getY(), 2, 0, Math.PI*2, false);
                context.fill();
            });
        }
        
        


        // context.beginPath();
        // context.arc(ship.position.getX(), ship.position.getY(), 10,
        //             0, Math.PI *2, false);
        // context.fill();
        
        if (ship.position.getX() > width){
            ship.position.setX(0);
        }

        if (ship.position.getX() < 0){
            ship.position.setX(width);
        }

        if (ship.position.getY() > height){
            ship.position.setY(0);
        }

        if (ship.position.getY() < 0){
            ship.position.setY(height);
        }
        
        requestAnimationFrame(update);
    }

}