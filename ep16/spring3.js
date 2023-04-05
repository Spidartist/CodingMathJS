window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        particleA = particle.create(utils.randomRange(0, width),
                                    utils.randomRange(0, height),
                                    utils.randomRange(0, 50),
                                    utils.randomRange(0, Math.PI * 2), 0.2),
        particleB = particle.create(utils.randomRange(0, width),
                                    utils.randomRange(0, height),
                                    utils.randomRange(0, 50),
                                    utils.randomRange(0, Math.PI * 2), 0.2),
        particleC = particle.create(utils.randomRange(0, width),
                                    utils.randomRange(0, height),
                                    utils.randomRange(0, 50),
                                    utils.randomRange(0, Math.PI * 2), 0.2),
        particles = [particleA, particleB, particleC],
        k = 0.01,
        dragged = false,
        separation = 200;

    particleA.friction = 0.9;
    particleA.radius = 20;

    particleB.friction = 0.9;
    particleB.radius = 20;

    particleC.friction = 0.9;
    particleC.radius = 20;

    document.body.addEventListener("mousedown", function(event){
        dragged = true;
    });

    document.body.addEventListener("mousemove", function(event){
        if (dragged){
            if (utils.particlePointCollision(event.clientX, event.clientY, particles[0])){
                console.log(1);
                particles[0].position.setX(event.clientX);
                particles[0].position.setY(event.clientY);
            }
        }
    })

    document.body.addEventListener("mouseup", function(event){
        if (dragged){
            if (!utils.particlePointCollision(event.clientX, event.clientY, particles[0])){
                dragged = false;    
            }
        }
    });



    update();

    function update(){
        context.clearRect(0, 0, width, height);

        for (var i=0;i<particles.length;i++){
            spring(particles[i], particles[(i+1)%particles.length], separation);
        }

        for (var i=0;i<particles.length;i++){
            checkEdges(particles[i]);
        }

        
        for (var i=0;i<particles.length;i++){
            particles[i].update();
        }

        for (var i=0;i<particles.length;i++){
            context.beginPath();
            context.arc(particles[i].position.getX(), particles[i].position.getY(), particles[i].radius, 0, Math.PI *2, false);
            if (i===0){
                context.fillStyle = "#f66"
            }else{
                context.fillStyle = "#f99"
            }    
            context.fill();
        }

        for (var i=0;i<particles.length;i++){
            context.beginPath();
            context.moveTo(particles[i].position.getX(), particles[i].position.getY());
            context.lineTo(particles[(i+1)%particles.length].position.getX(), particles[(i+1)%particles.length].position.getY());
            context.stroke();
        }

        requestAnimationFrame(update);
    }

    function spring(p0, p1, separation){
        var distance = p0.position.subtract(p1.position);
        distance.setLength(distance.getLength() - separation);
        
        var springForce = distance.multiply(k);
        p1.velocity.addTo(springForce);
        p0.velocity.subtractFrom(springForce);

    }

    function checkEdges(p) {
		if(p.position.getY() + p.radius > height) {
			p.position.setY(height - p.radius);
			p.velocity.setY(p.velocity.getY() * -0.95);
		}
	}

}