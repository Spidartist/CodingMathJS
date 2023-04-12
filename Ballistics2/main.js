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
        canShoot = true;
    cannonBall.radius = 7;
    draw();

    document.body.addEventListener("mousedown", onMouseDown);

    document.body.addEventListener("keyup", function(event){
        switch (event.keyCode) {
            case 32:
                console.log(event.keyCode);
                if (canShoot){
                    shoot();
                }
                break;
        
            default:
                break;
        }
    })

    function update(){
        cannonBall.update();
        draw();
        if (cannonBall.position.getY() > height){
            canShoot = true;
        }else{
            requestAnimationFrame(update);
        }
    }

	function shoot() {
	    cannonBall.position.setX(gun.x + Math.cos(gun.angle) * 40);
		cannonBall.position.setY(gun.y + Math.sin(gun.angle) * 40);
		cannonBall.velocity.setLength(15);
		cannonBall.velocity.setAngle(gun.angle);

		canShoot = false;
		update();
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
		draw();
	}

    function draw(){
        context.clearRect(0, 0, width, height);

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