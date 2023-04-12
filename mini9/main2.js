window.onload = function(){
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        results = [];

    for (var i =0;i < 100; i+=1){
        results[i] = 0;
    }

    update();

    function update(){
        addResult();
        draw();
        requestAnimationFrame(update);
    }

    function addResult(){
        var iterations = 3,
            total = 0;
        for (var i = 0; i< iterations;i+=1){
            total += utils.randomRange(0, 100);
        }
        var result = Math.floor(total / iterations);
        results[result] += 1;
    }

    function draw(){
        var w = width / 100;

        for (var i= 0; i< 100; i+=1){
            var h = results[i] * -10;
            context.fillRect(w*i, height, w, h);
        }
    }
}