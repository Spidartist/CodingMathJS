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
        cannonBall = particle.create(gun.x, gun.y, 15, gun.angle, 0.2),
        isShooting = false,
        forceSpeed = 0.1,
        forceAngle = 0,
        rawForce = 0;
    cannonBall.radius = 7;
    
    update();

    document.body.addEventListener("mousedown", onMouseDown);

    document.body.addEventListener("keydown", function(event){
        switch (event.keyCode) {
            case 32:
                console.log(event.keyCode);
                if (!isShooting){
                    shoot();
                }
                break;
        
            default:
                break;
        }
    })

    function update(){
        if (!isShooting){
            forceAngle += forceSpeed;
        }
        rawForce = Math.sin(forceAngle);
        if (isShooting){
            cannonBall.update();
        }
        draw();
        if (cannonBall.position.getY() > height){
            isShooting = false;
        }
        requestAnimationFrame(update);
    }

	function shoot() {
	    cannonBall.position.setX(gun.x + Math.cos(gun.angle) * 40);
		cannonBall.position.setY(gun.y + Math.sin(gun.angle) * 40);
		cannonBall.velocity.setLength(utils.map(rawForce, -1, 1, 2, 20));
		cannonBall.velocity.setAngle(gun.angle);

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

        context.beginPath();
        context.arc(gun.x, gun.y, 24, 0, Math.PI * 2, false);
        context.fill();
        context.save();
        
        context.translate(gun.x, gun.y);
        context.rotate(gun.angle);
        context.fillRect(0, -8, 40, 16);
        context.restore();

        context.beginPath();
        context.arc(cannonBall.position.getX(), cannonBall.position.getY(), cannonBall.radius, 0, Math.PI * 2, false);
        context.fill();

    }
}