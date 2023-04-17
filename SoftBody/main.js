window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        points = [],
        originalPoints = [],
        numPoints = 6,
        rectBoundary = {
            x: 200,
            y: 200,
            width: 400,
            height: 400
        },
        k = 0.01,
        grav = 0.0;

    setup();
    update();

    function setup(){
        var p;
        p = particle.create(295, 279, 0, 0, grav);
        points.push(p);
        p = particle.create(295 + 50, 279 + 100, 0, 0, grav);
        points.push(p);
        p = particle.create(295, 479, 0, 0, grav);
        points.push(p);
        p = particle.create(495, 479, 0, 0, grav);
        points.push(p);
        p = particle.create(495 - 50, 279 + 100, 0, 0, grav);
        points.push(p);
        p = particle.create(495, 279, 0, 0, grav);
        points.push(p);
        originalPoints = points;
        console.log(1);
    }

    function spring(p0, p1, separation){
        var distance = p0.position.subtract(p1.position);
        distance.setLength(distance.getLength() - separation);
        
        var springForce = distance.multiply(k);
        p1.velocity.addTo(springForce);
        p0.velocity.subtractFrom(springForce);

    }

    document.body.addEventListener("mousemove", function(event){
        points[0].position.setX(event.clientX);
        points[0].position.setY(event.clientY);
    })

    function checkEdges(p){
        if (p.position.getX() > rectBoundary.x + rectBoundary.width){
            p.position.setX(rectBoundary.x + rectBoundary.width);
            p.velocity.setX(p.velocity.getX() * -1);
        }
        if (p.position.getX() < rectBoundary.x){
            p.position.setX(rectBoundary.x);
            p.velocity.setX(p.velocity.getX() * -1);
        }
        if (p.position.getY() > rectBoundary.y + rectBoundary.height){
            p.position.setY(rectBoundary.y + rectBoundary.height);
            p.velocity.setY(p.velocity.getY() * -1);
        }
        if (p.position.getY() < rectBoundary.y){
            p.position.setY(rectBoundary.y);
            p.velocity.setY(p.velocity.getY() * -1);
        }
    }

    function update(){
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.strokeRect(rectBoundary.x, rectBoundary.y, rectBoundary.width, rectBoundary.height);

        for (var i=0;i<numPoints;i++){
            spring(points[i], points[(i+1)%numPoints], originalPoints[i].position.subtract(originalPoints[(i+1)%numPoints].position).getLength());
        }
        spring(points[1], points[4], originalPoints[1].position.subtract(originalPoints[4].position).getLength());
        spring(points[0], points[3], originalPoints[0].position.subtract(originalPoints[3].position).getLength());
        console.log(originalPoints[0].position);
        spring(points[2], points[5], originalPoints[2].position.subtract(originalPoints[5].position).getLength());

        for (var i=0;i<numPoints;i++){
            checkEdges(points[i]);
        }

        for (var i=0;i<numPoints;i++){
            points[i].update();
        }

        for (var i=0;i<numPoints;i++){
            context.beginPath();
            context.arc(points[i].position.getX(), points[i].position.getY(), 5, 0, Math.PI * 2, false);
            context.fill();
        }

        for (var i=0;i<numPoints;i++){
            context.beginPath();
            context.moveTo(points[i].position.getX(), points[i].position.getY());
            context.lineTo(points[(i+1)%numPoints].position.getX(), points[(i+1)%numPoints].position.getY());
            context.stroke();
        }

        for (var i=0;i<=2;i++){
            context.beginPath();
            context.moveTo(points[i].position.getX(), points[i].position.getY())
            context.lineTo(points[i+3].position.getX(), points[i+3].position.getY());
            context.stroke();
        }

        requestAnimationFrame(update);
    }
}