window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    ship = particle.create(width/2, height/2, 0, 0,0),
    thrush = vector.create(0, 0),
    bullets = [],
    obstacles = [],
    angle = 0,
    turningLeft = false,
    turningRight = false,
    thrusting = false,
    fire = false;

    ship.friction = 0.99;

    obstacles.push(obstacle.create(0, utils.randomRange(0, height), 2, Math.random(3)));

    update();

    document.body.addEventListener("keydown", function(event){
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
                bullets.push(bullet.create(ship.x, ship.y, 6, angle));
                break;
            default:
                break;
        }
    });

    document.body.addEventListener("keyup", function(event){
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

        // if (Math.random() < 0.01){
        //     var seed = utils.randomInt(1, 4);
        //     switch (seed) {
        //         case 1:
        //             obstacles.push(obstacle.create(0,
        //                             utils.randomRange(0, height),
        //                             utils.randomRange(2, 5),
        //                             utils.randomRange(0, Math.PI * 2)));
        //             break;
        //         case 2:
        //             obstacles.push(obstacle.create(width,
        //                                         utils.randomRange(0, height),
        //                                         utils.randomRange(2, 5),
        //                                         utils.randomRange(0, Math.PI * 2)));
        //             break;
        //         case 3:
        //             obstacles.push(obstacle.create(utils.randomRange(0, width),
        //                             0,
        //                             utils.randomRange(2, 5),
        //                             utils.randomRange(0, Math.PI * 2)));
        //             break;
        //         case 4:
        //             obstacles.push(obstacle.create(utils.randomRange(0, width),
        //                             height,
        //                             utils.randomRange(2, 5),
        //                             utils.randomRange(0, Math.PI * 2)));
        //             break;           
        //     }

        // }

        for (var i = 0;i<obstacles.length;i++){
            var o = obstacles[i];
            o.update();
        }

        for (var i = 0;i<bullets.length;i++){
            var b = bullets[i];
            b.update();
        }

        context.fillStyle = "red";
        for (var i = bullets.length - 1; i>=0; i--){
            var b = bullets[i];
            if (b.x < 0 || b.x > width || b.y < 0 || b.y > height){
                bullets.splice(i, 1);
            }else{
                context.beginPath();
                context.arc(b.x, b.y, b.radius, 0, Math.PI * 2, false);
                context.fill();
            }
        }

        context.fillStyle = "green";
        for (var i = obstacles.length - 1; i>=0; i--){
            var o = obstacles[i];
            if (o.x < 0 || o.x > width || o.y < 0 || o.y > height){
                obstacles.splice(i, 1);
            }else{
                context.beginPath();
                context.arc(o.x, o.y, o.radius, 0, Math.PI * 2, false);
                context.fill();
            }
        }

        for (var j = bullets.length - 1; j>=0; j--){
            var b = bullets[j];
            for (var i = obstacles.length - 1; i>=0; i--){
                var o = obstacles[i];
                if (utils.circleCollision(o, b)){
                    console.log(obstacles.length);
                    obstacles.slice(i, 1);
                    bullets.splice(j, 1);
                }
            }
        }

        
        // Todo: seperate check boundary

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