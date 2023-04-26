window.onload = function(){
    var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    target = {
        x: width,
        y: Math.random() * height
    },
    points = [],
    numPoints = 100,
    ease = 0.2;

    for (var i = 0;i<numPoints;i++){
        points.push({
            x: 0,
            y: 0
        })
    }

    update();

    document.body.addEventListener("mousemove", function(event){
        target.x = event.clientX;
        target.y = event.clientY;
    })


    function update(){
        context.clearRect(0, 0, width, height);

        var leader = {
            x: target.x,
            y: target.y
        };

        for (var i=0;i<numPoints;i++){
            var p = points[i];
            p.x += (leader.x - p.x) * ease;
            p.y += (leader.y - p.y) * ease;

            if (i==0){
                context.moveTo(p.x, p.y);
            }else{
                context.lineTo(p.x, p.y);
            }
            

            leader.x = p.x;
            leader.y = p.y;
        }
        // little buggy but cool
        context.stroke();
        
        requestAnimationFrame(update);
    }

}