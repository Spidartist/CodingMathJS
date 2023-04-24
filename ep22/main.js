window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    fl = 300,
    shapePos = {
        x: 500,
        y: 300,
        z: 300
    };

    context.translate(width/2, height/2);
    var perspective = fl / (fl + shapePos.z);

    context.translate(shapePos.x * perspective, shapePos.y * perspective);
    context.scale(perspective, perspective);
    

    update();

    function update(){
        context.clearRect(0, 0, width, height);

        //

        requestAnimationFrame(update);
    }

}