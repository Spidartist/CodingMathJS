window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    minX = 50,
    maxX = width - 50,
    minY = 100,
    maxY = height - 100,
    minAlpha = 0,
    maxAlpha = 1,
    minRadius = 10, 
    maxRadius = 400,
    t = 0;

    update();

    function update(){
        context.clearRect(0, 0, width, height);

        //

        requestAnimationFrame(update);
    }

}