window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        targetHealth = 100,
        gun = {
            x : 100,
            y : height,
            angle: -Math.PI / 4,
            radius: 24,
            health: targetHealth
        },
        gun_1 = {
            x : width - 100,
            y : height,
            angle: -3*Math.PI / 4,
            radius: 24,
            health: targetHealth
        },
        cannonBall = particle_op.create(gun.x, gun.y, 15, gun.angle, 0.2),
        isShooting = false,
        forceSpeed = 0.02,
        forceAngle = -Math.PI/2,
        rawForce = 0,
        particles = [],
        numParticles = 100,
        oldForce = 0;
        isTrung =false,
        isSpace = false,
        windForce = 0.0,
        turnSpeed = 10,
        damageToTarget = 20,
        numTurn = true,
        target= {};
    cannonBall.radius = 7;

    update();

    function setFirework(){
        numParticles = 50;
        particles = [];
        for (var i=0; i<numParticles;i++){
            var p = particle_op.create(target.x, target.y - target.radius, Math.random()*5+1, Math.random()*Math.PI*2, 0.1);
            p.radius = 1;
            particles.push(p);
        }
    }

    document.body.addEventListener("keydown", function(event){
        // console.log(event.keyCode);
        switch (event.keyCode) {
            case 32: // space
                if (!isShooting){
                    isSpace = true;
                }
                break;
            case 39: // right
                if (numTurn){
                    gun.x += turnSpeed;
                }else{
                    gun_1.x += turnSpeed;
                }
                break;
            case 37: // left
            if (numTurn){
                gun.x -= turnSpeed;
            }else{
                gun_1.x -= turnSpeed;
            }
                break
            default:
                break;
        }
    })

    document.body.addEventListener("keyup", function(event){
        switch (event.keyCode) {
            case 32: // space
                if (isSpace){
                    shoot();
                }
                isSpace = false;
                forceAngle = -Math.PI/2;
                if (numTurn){
                    numTurn = false;
                }else{
                    numTurn = true;
                }
                break;
        
            default:
                break;
        }
    })

    function update(){
        if (!isShooting && isSpace){
            forceAngle += forceSpeed;
        }
        rawForce = Math.sin(forceAngle);
        if (isShooting){
            cannonBall.update();
            cannonBall.windUp(windForce);
            checkTarget();
        }
        draw();
        if (cannonBall.y > height || cannonBall.x > width){
            isShooting = false;
            windForce = utils.randomRange(-2.0, 2.0);
            cannonBall.x = -10;
            cannonBall.y = -10;
        }
        requestAnimationFrame(update);
    }

    function checkTarget(){
        if (numTurn){
            target = gun;
        }else{
            target = gun_1;
        }
        if (utils.circleCollision(target, cannonBall)){
            console.log(1);
            isTrung = true;
            target.health -= damageToTarget;
            cannonBall.x = width + 10;
            cannonBall.y = height + 10;
            setFirework();       
        }
    }

	function shoot() {
		var force = utils.map(rawForce, -1, 1, 2, 20);
        var r_gun;
        if (numTurn){
            r_gun = gun;
        }else{
            r_gun = gun_1;
        }
		cannonBall.x = r_gun.x + Math.cos(r_gun.angle) * 40;
		cannonBall.y = r_gun.y + Math.sin(r_gun.angle) * 40;
		cannonBall.vx = Math.cos(r_gun.angle) * force;
		cannonBall.vy = Math.sin(r_gun.angle) * force;
        oldForce = rawForce;
		isShooting = true;
	}

    document.body.addEventListener("mousedown", onMouseDown);
    
    function onMouseDown(event){
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        aimGun(event.clientX, event.clientY);
    }

    function onMouseMove(event){
        aimGun(event.clientX, event.clientY);
    }

    function onMouseUp(event){
        document.body.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseup", onMouseUp);
        aimGun(event.clientX, event.clientY);
    }

    function aimGun(mouseX, mouseY) {
        if (numTurn){
            gun.angle = utils.clamp(Math.atan2(mouseY - gun.y, mouseX - gun.x), -Math.PI / 2, -0.3)
        }else{
            gun_1.angle = utils.clamp(Math.atan2(mouseY - gun_1.y, mouseX - gun_1.x), -Math.PI / 2, 0.3 - Math.PI);
        }
	}

    function draw(){
        context.clearRect(0, 0, width, height);

        // Wind force
        context.font = "20px serif";
        context.strokeText(`Wind ${windForce.toFixed(1)}`, width/2, 20);

        if (!isShooting){
            context.strokeText("Bantumlum di!!!", width/2 - 40, 100);
        }

        // Force bar
        context.fillStyle = "#ccc";
        context.fillRect(10, height - 10, 30, -200);

        context.fillStyle = "#666";
        context.fillRect(10, height - 10, 30, utils.map(rawForce, -1, 1, 0, -200));

        if (numTurn){
            target = gun_1;
        }else{
            target = gun;
        }
        // Target healthbar
        context.fillStyle = "#ccc";
        context.fillRect(target.x - targetHealth/2, target.y - 20 - target.radius, targetHealth, 10);

        context.fillStyle = "#666";
        context.fillRect(target.x - targetHealth/2, target.y - 20 - target.radius, utils.map(target.health, 0, 100, 0, 100), 10);

        // Todo: add spring

        // Arc for wind force
        if (windForce >= 0){
            context.beginPath();
            context.moveTo(width/2, 40);
            context.lineTo(width/2 + 60, 40);
            context.lineTo(width/2 + 50, 30);
            context.moveTo(width/2 + 60, 40);
            context.lineTo(width/2 + 50, 50);
            context.stroke();
        }else{
            context.beginPath();
            context.moveTo(width/2 + 60, 40);
            context.lineTo(width/2, 40);
            context.lineTo(width/2 + 10, 30);
            context.moveTo(width/2, 40);
            context.lineTo(width/2 + 10, 50);
            context.stroke();
        }

        // Old force bar
        context.globalAlpha = 0.7;
        context.fillStyle = "#6cc";
        context.fillRect(10, height -10, 30, utils.map(oldForce, -1, 1, 0, -200));
        context.globalAlpha = 1;

        context.fillStyle = "#000";
        // if (numTurn){
        //     context.globalAlpha = 1;
        //     context.fillStyle = "#000";
        //     context.beginPath();
        //     context.arc(gun.x, gun.y, gun.radius, 0, Math.PI * 2, false);
        //     context.fill();
        //     context.save();
        //     context.translate(gun.x, gun.y);
        //     context.rotate(gun.angle);
        //     context.fillRect(0, -8, 40, 16);
        //     context.restore();
        // }else{
        //     context.beginPath();
        //     context.arc(gun_1.x, gun_1.y, gun_1.radius, 0, Math.PI * 2, false);
        //     context.fill();
        //     context.save();
        //     context.translate(gun_1.x, gun_1.y);
        //     context.rotate(gun_1.angle);
        //     context.fillRect(0, -8, 40, 16);
        //     context.restore();
        // }

        context.globalAlpha = 1;
        context.fillStyle = "#000";
        context.beginPath();
        context.arc(gun.x, gun.y, gun.radius, 0, Math.PI * 2, false);
        context.fill();
        context.save();
        context.translate(gun.x, gun.y);
        context.rotate(gun.angle);
        context.fillRect(0, -8, 40, 16);
        context.restore();

        context.fillStyle = "green";
        context.beginPath();
        context.arc(gun_1.x, gun_1.y, gun_1.radius, 0, Math.PI * 2, false);
        context.fill();
        context.save();
        context.translate(gun_1.x, gun_1.y);
        context.rotate(gun_1.angle);
        context.fillRect(0, -8, 40, 16);
        context.restore();

        
        if (!numTurn){
            context.fillStyle = "#000";
        }
        // Cannonball
        context.beginPath();
        context.arc(cannonBall.x, 
                    cannonBall.y,
                    cannonBall.radius, 
                    0, Math.PI * 2, false);
        context.fill();
        
        // Firework when hitting
        if (isTrung){
            for (var i=0;i< numParticles;i++){
                var p = particles[i];
                p.update();

                context.fillStyle = "blue";
                context.beginPath();
                context.arc(p.x, p.y, p.radius, 0, 2*Math.PI, false);
                context.fill();
            }
        }

    }
}