window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    points = [],
    numPoints = 5;

    for (var i = 0;i<numPoints;i++){
        p = {
            x: Math.random() * width,
            y: Math.random() * height
        }
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, Math.PI * 2, false);
        context.fill();

        points.push(p);
    }

    context.strokeStyle = "lightgray";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (var i=1;i<numPoints;i++){
        context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    context.strokeStyle = "black";

    context.beginPath();
    utils.multicurve(points, context);
    context.stroke();

    // update();

    function update(){
        context.clearRect(0, 0, width, height);

        //

        requestAnimationFrame(update);
    }

}