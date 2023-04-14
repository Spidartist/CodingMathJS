window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        gun = {
            x : 100,
            y : height,
            angle: -Math.PI / 4
        },
        cannonBall = particle_op.create(gun.x, gun.y, 15, gun.angle, 0.2),
        isShooting = false,
        forceSpeed = 0.05,
        forceAngle = -Math.PI/2,
        rawForce = 0,
        target = {},
        particles = [],
        numParticles = 100,
        oldForce = 0;
        isTrung =false,
        isSpace = false;
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
        // isTrung = false;
        target.x = utils.randomRange(200, width);
        target.y = height;
        target.radius = utils.randomRange(10, 40);
    }

    document.body.addEventListener("mousedown", onMouseDown);

    document.body.addEventListener("keydown", function(event){
        switch (event.keyCode) {
            case 32: // space
                if (!isShooting){
                    isSpace = true;
                }
                break;
        
            default:
                break;
        }
    })

    document.body.addEventListener("keyup", function(event){
        switch (event.keyCode) {
            case 32: // space
                shoot();
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
            checkTarget();
        }
        draw();
        if (cannonBall.y > height){
            isShooting = false;
        }
        requestAnimationFrame(update);
    }

    function checkTarget(){
        if (utils.circleCollision(target, cannonBall)){
            isTrung = true;
            setFirework();
            setTarget();
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

        context.fillStyle = "#ccc";
        context.fillRect(10, height -10, 20, -100);

        

        context.fillStyle = "#666";
        context.fillRect(10, height -10, 20, utils.map(rawForce, -1, 1, 0, -100));


        context.globalAlpha = 0.7;
        context.fillStyle = "#6cc";
        context.fillRect(10, height -10, 20, utils.map(oldForce, -1, 1, 0, -100));
        context.globalAlpha = 1;

        context.fillStyle = "#000";

        context.beginPath();
        context.arc(gun.x, gun.y, 24, 0, Math.PI * 2, false);
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