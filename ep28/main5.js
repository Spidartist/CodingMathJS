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
    numPoints = 30,
    ease = 0.4;

    for (var i = 0;i<numPoints;i++){
        p = {
            x: 0,
            y: 0,
            img: document.createElement("img")
        };
        if (i==0){
            p.img.src = "./pixil-frame-0 (3).png"
        }else{
            p.img.src = "./pixil-frame-0 (4).png"
        }
        points.push(p);
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

            // context.drawImage(p.img, p.x, p.y);

            leader.x = p.x;
            leader.y = p.y;
        }

        

        for (var i=numPoints-1;i>=0;i--){
            var p = points[i];
            // context.save();
            // context.scale(1.2, 1.2);
            context.drawImage(p.img, p.x, p.y);
            // context.restore();
        }

        
        requestAnimationFrame(update);
    }

}