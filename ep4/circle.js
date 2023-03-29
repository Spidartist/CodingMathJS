window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    centerX = width/2,
    centerY = height/2,
    radius = 200,
    xRadius = 200,
    yRadius = 400,
    angle = 0,
    xangle = 0,
    yangle =0,
    xspeed = 0.1,
    yspeed = 0.131,
    speed = 0.01,
    numObjects = 10,
    slice = 2 * Math.PI / numObjects,
    x, y;

    for (var i =0;i<numObjects;i+=1){
        angle = i * slice;
        x = centerX + Math.cos(angle)*radius;
        y = centerY + Math.sin(angle)*radius;
        context.beginPath();
        context.arc(x, y, 10, 0, 2* Math.PI, false);
        context.fill();
    }

    // render();

    function render(){
        // context.clearRect(0, 0, width, height);
        x = centerX + Math.cos(xangle) * xRadius;
        y = centerY + Math.sin(yangle) * yRadius;
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI*2, false);
        context.fill();

        xangle += xspeed;
        yangle += yspeed;

        requestAnimationFrame(render);
    }
}