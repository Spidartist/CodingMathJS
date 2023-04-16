window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        gun = {
            x : 100,
            y : height,
            angle: -Math.PI / 4,
            radius: 24
        },
        cannonBall = particle_op.create(gun.x, gun.y, 15, gun.angle, 0.2),
        isShooting = false,
        forceSpeed = 0.02,
        forceAngle = -Math.PI/2,
        rawForce = 0,
        target = {},
        particles = [],
        numParticles = 100,
        oldForce = 0;
        isTrung =false,
        isSpace = false,
        windForce = 0.0,
        turnSpeed = 3,
        targetHealth = 100,
        damageToTarget = 20;
    cannonBall.radius = 7;

    setTarget();
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

    function setTarget(){
        target.x = utils.randomRange(200, width);
        target.health = targetHealth;
        // target.y = height;
        target.y = utils.randomRange(200, height);
        target.radius = utils.randomRange(10, 40);
    }

    document.body.addEventListener("mousedown", onMouseDown);

    document.body.addEventListener("keydown", function(event){
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 32: // space
                if (!isShooting){
                    isSpace = true;
                }
                break;
            case 39: // right
                gun.x += turnSpeed;
                break;
            case 37: // left
                gun.x -= turnSpeed;
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
        if (utils.circleCollision(target, cannonBall)){
            isTrung = true;
            target.health -= damageToTarget;
            cannonBall.x = width + 10;
            cannonBall.y = height + 10;
            setFirework();
            if (target.health <= 0){
                setTarget();  
            }         
        }
    }

	function shoot() {
		var force = utils.map(rawForce, -1, 1, 2, 20);
		cannonBall.x = gun.x + Math.cos(gun.angle) * 40;
		cannonBall.y = gun.y + Math.sin(gun.angle) * 40;
		cannonBall.vx = Math.cos(gun.angle) * force;
		cannonBall.vy = Math.sin(gun.angle) * force;
        oldForce = rawForce;
		isShooting = true;
	}

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
		gun.angle = utils.clamp(Math.atan2(mouseY - gun.y, mouseX - gun.x), -Math.PI / 2, -0.3);
	}

    function draw(){
        context.clearRect(0, 0, width, height);

        context.font = "20px serif";
        context.strokeText(`Wind ${windForce.toFixed(1)}`, width/2, 20);

        if (!isShooting){
            context.strokeText("Bantumlum di!!!", width/2 - 40, 100);
        }

        context.fillStyle = "#ccc";
        context.fillRect(10, height - 10, 30, -200);

        context.fillStyle = "#666";
        context.fillRect(10, height - 10, 30, utils.map(rawForce, -1, 1, 0, -200));

        context.fillStyle = "#ccc";
        context.fillRect(target.x - targetHealth/2, target.y - 20 - target.radius, targetHealth, 10);

        context.fillStyle = "#666";
        context.fillRect(target.x - targetHealth/2, target.y - 20 - target.radius, utils.map(target.health, 0, 100, 0, 100), 10);

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

        context.globalAlpha = 0.7;
        context.fillStyle = "#6cc";
        context.fillRect(10, height -10, 30, utils.map(oldForce, -1, 1, 0, -200));
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

        context.beginPath();
        context.arc(cannonBall.x, 
                    cannonBall.y,
                    cannonBall.radius, 
                    0, Math.PI * 2, false);
        context.fill();

        context.fillStyle = "red";
        context.beginPath();
        context.arc(target.x, target.y, target.radius, 0, Math.PI * 2, false);
        context.fill();

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