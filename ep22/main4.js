window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    fl = 300,
    shapes = [],
    numShapes = 100,
    alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "m", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


    for (var i = 0;i < numShapes; i++){
        shapes[i] = {
            x: utils.randomRange(-1000, 1000),
            y: utils.randomRange(-1000, 1000),
            z: utils.randomRange(0, 10000),
            char: alphabet[utils.randomInt(0, alphabet.length - 1)]
        }
    }

    
    context.translate(width/2, height/2);
    context.font = "200px serif";

    update();
    function update(){
        context.clearRect(-width/2, -height/2, width, height);
        for (var i = 0;i < numShapes; i++){
            var shape = shapes[i],
                perspective = fl / (fl + shape.z);
            
                context.save();
                context.translate(shape.x * perspective, shape.y * perspective);
                context.scale(perspective, perspective);
                context.fillText(shape.char, -100, -100);
                context.restore();

                shape.z -= 5;
                if (shape.z < 0){
                    shape.z = 10000;
                }

        }

        requestAnimationFrame(update);
    }

}