window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    points = [],
    numPoints = 6,
    rectBoundary = {
        x: 200,
        y: 200,
        width: 400,
        height: 400
    },
    k = 0.01,
    grav = 0.2;

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
    }
    function calDist(p0, p1){
        var dx = p0.x - p1.x,
            dy = p0.y - p1.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function spring(p0, p1){
        var dx = p0.x - p1.x,
            dy = p0.y - p1.y;
        var dist = vector.create(dx, dy);
        dist.setLength(dist.getLength() - 20);
        var springForce = dist.multiply(k);

        p1.dx += springForce.getX();
        p1.dy += springForce.getY();
        p0.dx -= springForce.getX();
        p0.dy -= springForce.getY();
    }

    document.body.addEventListener("mousemove", function(event){
        points[0].x = event.clientX;
        points[0].y = event.clientY;
    })

    function checkEdges(p){
        if (p.x > rectBoundary.x + rectBoundary.width){
            p.x = rectBoundary.x + rectBoundary.width;
            p.dx = p.dx * -1;
        }
        if (p.x < rectBoundary.x){
            p.x = rectBoundary.x
            p.dx = p.dx * -1;
        }
        if (p.y > rectBoundary.y + rectBoundary.height){
            p.y = rectBoundary.y + rectBoundary.height;
            p.dy = p.dy * -1;
        }
        if (p.y < rectBoundary.y){
            p.y = rectBoundary.y
            p.dy = p.dy * -1;
        }
    }

    function update(){
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.strokeRect(rectBoundary.x, rectBoundary.y, rectBoundary.width, rectBoundary.height);

        for (var i=0;i<numPoints;i++){
            spring(points[i], points[(i+1)%numPoints]);
        }
        spring(points[1], points[4]);
        spring(points[0], points[3]);
        spring(points[2], points[5]);

        for (var i=0;i<numPoints;i++){
            checkEdges(points[i]);
        }

        for (var i=0;i<numPoints;i++){
            points[i].update();
        }

        for (var i=0;i<numPoints;i++){
            context.beginPath();
            context.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2, false);
            context.fill();
        }

        for (var i=0;i<numPoints;i++){
            context.beginPath();
            context.moveTo(points[i].x, points[i].y)
            context.lineTo(points[(i+1)%numPoints].x, points[(i+1)%numPoints].y);
            context.stroke();
        }

        for (var i=0;i<=2;i++){
            context.beginPath();
            context.moveTo(points[i].x, points[i].y)
            context.lineTo(points[i+3].x, points[i+3].y);
            context.stroke();
        }

        requestAnimationFrame(update);
    }
}