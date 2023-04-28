window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    ship = particle.create(width/2, height/2, 0, 0,0),
    thrush = vector.create(0, 0),
    bullets = [],
    angle = 0,
    turningLeft = false,
    turningRight = false,
    thrusting = false,
    fire = false;

    ship.friction = 0.99;

    update();

    document.body.addEventListener("keydown", function(event){
        // console.log(event.keyCode);
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
            case 32:
                fire = true;
                bullets.push(bullet.create(ship.x, ship.y, 2, angle));
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
        thrush.setAngle(angle);
        if (thrusting){
            thrush.setLength(0.1);
        }else{
            thrush.setLength(0);
        }


        ship.accelerate(thrush.getX(), thrush.getY());
        ship.update();
        context.save();
        context.translate(ship.x, ship.y);
        context.rotate(angle);

        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(10, 0);
        context.lineTo(-10, -7);
        context.lineTo(-10, 7);
        context.lineTo(10, 0);
        context.fillStyle = "red";
        context.fill();
        if (thrusting){
            context.moveTo(-10, 0);
            context.lineTo(-18, 0);
        }
        context.stroke();
        context.restore();

        context.fillStyle = "red";
        for (var i = 0;i<bullets.length;i++){
            var b = bullets[i];
            b.update();
            console.log(bullets.length);
            if (b.x < 0 || b.x > width || b.y < 0 || b.y > height){
                bullets.splice(i, 1);
            }else{
                context.beginPath();
                context.arc(b.x, b.y, 2, 0, Math.PI * 2, false);
                context.fill();
            }

        }

        
        
        if (ship.x > width){
            ship.x = 0;
        }

        if (ship.x < 0){
            ship.x = width;
        }

        if (ship.y > height){
            ship.y = 0;
        }

        if (ship.y < 0){
            ship.y = height;
        }
        
        requestAnimationFrame(update);
    }

}