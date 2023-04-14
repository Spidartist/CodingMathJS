function setFirework(width, height, numParticles, particles){
    numParticles = 50;
    particles = [];
    for (var i=0; i<numParticles;i++){
        particles.push(particle_op.create(width/2, height/2, Math.random()*5+1, Math.random()*Math.PI*2, 0.1))
    }
}

function updateFirework(context, numParticles, particles){
    for (var i=0;i< numParticles;i++){
        var p = particles[i];
        p.update();
        context.beginPath();
        context.arc(p.x, p.y, 10, 0, 2*Math.PI, false);
        context.fill();
    }
}


