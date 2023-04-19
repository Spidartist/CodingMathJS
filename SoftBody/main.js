window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        points = [],
        originalPoints = [],
        numPoints = 6,
        // rectBoundary = {
        //     x: 200,
        //     y: 200,
        //     width: 400,
        //     height: 400
        // },
        k = 0.4,
        rectObj = {};
        isFill = true,
        grav = 1;

    setup();
    update();
    
    function calDist(p0, p1){
        var dx = p0.position.getX() - p1.position.getX(),
            dy = p0.position.getY() - p1.position.getY();
        return Math.sqrt(dx*dx + dy*dy);
    }

    function setup(){
        var p;
        p = particle.create(200, 100, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        p = particle.create(400, 100, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        p = particle.create(350, 200, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        p = particle.create(400, 300, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        p = particle.create(200, 300, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        p = particle.create(250, 200, 0, 0, grav);
        p.friction = 0.9;
        points.push(p);
        for (var i = 0; i<numPoints;i++){
            originalPoints.push(calDist(points[i], points[(i+1)%numPoints]));
        }

        for (var i=0;i<=2;i++){
            originalPoints.push(calDist(points[i], points[i+3]));
        }
        originalPoints.push(calDist(points[1], points[3]));
        originalPoints.push(calDist(points[0], points[4]));
    }

    function spring(p0, p1, separation, k){
        var distance = p0.position.subtract(p1.position);
        distance.setLength(distance.getLength() - separation);
        
        var springForce = distance.multiply(k);
        p1.velocity.addTo(springForce);
        p0.velocity.subtractFrom(springForce);

    }

    function changePos(event){
        points[0].position.setX(event.clientX);
        points[0].position.setY(event.clientY);
    }
    
    document.body.addEventListener("mousedown", onMouseDown);
    
    function onMouseDown(event){
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
        changePos(event);
    }

    function onMouseMove(event){
        changePos(event);
    }

    function onMouseUp(event){
        document.body.removeEventListener("mousemove", onMouseMove);
        document.body.removeEventListener("mouseup", onMouseUp);
        changePos(event);
    }

    // document.body.addEventListener("mousedown", function(event){
    //     points[0].position.setX(event.clientX);
    //     points[0].position.setY(event.clientY);
    // })

    document.body.addEventListener("keydown", function(event){
        if (event.keyCode == 32){
            if (isFill){
                isFill = false;
            }else{
                isFill = true;
            }
        }
    })

    // function checkEdges(p){
    //     if (p.position.getX() > rectBoundary.x + rectBoundary.width){
    //         p.position.setX(rectBoundary.x + rectBoundary.width);
    //         // p.velocity.setX(p.velocity.getX() * -0.8);
    //     }
    //     if (p.position.getX() < rectBoundary.x){
    //         p.position.setX(rectBoundary.x);
    //         // p.velocity.setX(p.velocity.getX() * -0.8);
    //     }
    //     if (p.position.getY() > rectBoundary.y + rectBoundary.height){
    //         p.position.setY(rectBoundary.y + rectBoundary.height);
    //         // p.velocity.setY(p.velocity.getY() * -0.8);
    //     }
    //     if (p.position.getY() < rectBoundary.y){
    //         p.position.setY(rectBoundary.y);
    //         // p.velocity.setY(p.velocity.getY() * -0.8);
    //     }
    // }

    function checkEdges(p){
        if (p.position.getX() > width){
            p.position.setX(width);
        }
        if (p.position.getX() < 0){
            p.position.setX(0);
        }
        if (p.position.getY() > height){
            p.position.setY(height);
        }
        if (p.position.getY() < 0){
            p.position.setY(0);
        }
    }

    function update(){
        context.clearRect(0, 0, width, height);
        context.beginPath();
        // context.strokeRect(rectBoundary.x, rectBoundary.y, rectBoundary.width, rectBoundary.height);

        for (var i=0;i<numPoints;i++){
            spring(points[i], points[(i+1)%numPoints], originalPoints[i], k);
        }
        spring(points[0], points[3], originalPoints[6], k);
        spring(points[1], points[4], originalPoints[7], k);
        spring(points[2], points[5], originalPoints[8], 0.5);
        // spring(points[1], points[3], originalPoints[9], 0.5);
        // spring(points[0], points[4], originalPoints[10], 0.5);

        for (var i=0;i<numPoints;i++){
            points[i].update();
        }
        for (var i=0;i<numPoints;i++){
            checkEdges(points[i]);
        }


        


        if (isFill){
            context.globalAlpha = 0.2;
            context.beginPath();
            context.moveTo(points[0].position.getX(), points[0].position.getY());
            context.lineTo(points[1].position.getX(), points[1].position.getY());
            context.lineTo(points[2].position.getX(), points[2].position.getY());
            context.lineTo(points[3].position.getX(), points[3].position.getY());
            context.lineTo(points[4].position.getX(), points[4].position.getY());
            context.lineTo(points[5].position.getX(), points[5].position.getY());
            context.fill();
            context.globalAlpha = 1;
        }else{
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
    
            context.beginPath();
            context.moveTo(points[0].position.getX(), points[0].position.getY())
            context.lineTo(points[4].position.getX(), points[4].position.getY());
            context.stroke();
    
            context.beginPath();
            context.moveTo(points[1].position.getX(), points[1].position.getY())
            context.lineTo(points[3].position.getX(), points[3].position.getY());
            context.stroke();
        }

        

        requestAnimationFrame(update);
    }
}