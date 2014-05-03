
// variables
var canvasWidth        = Math.min(2/3*innerWidth,innerHeight-250),
    canvasHeight       = canvasWidth,
    smallCircleR    = 50,
    tinyCircleR     = 5,
    tinyTheta       = 0,
    tinyOmega       = .1,
    smallTheta      = 0,
    smallOmega      = -.01,
    largeTheta      = 0,
    largeOmega      = .001,
    rotationAngle   = 0,
    pointerLocation = [],
    lineWidth       = 1,
    lineColor       = ' RGBA(255,255,255,.5)',
    canvas          = d3.select("#a").append("canvas")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .style('margin-top',(innerHeight-canvasHeight)/2+'px')
        .on("click", changePointerLoc),
    canvas2          = d3.select("#a").append("canvas")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .attr('id','hide'),
    ctx             =canvas[0][0].getContext("2d");
    ctx2             =canvas2[0][0].getContext("2d");
l = true
pointerLocation = [150,150]

function get(el)
{
    return(parseFloat(document.getElementById(el).value))
}

function pause()
{
    s = document.getElementById('speed')
    p = document.getElementById('pause')

    if (p.innerHTML.indexOf("pause") != -1)
    {
        s.value = '0';
        p.innerHTML= 'go'
    }

    else if (p.innerHTML.indexOf("go") != -1)
    {
        s.value = '.01';
        p.innerHTML= 'pause'
    }
// pause reset Speed Circle 1 Radius Circle 2 Radius 
}


function reset()
{
     // var dataURL = canvas[0][0].toDataURL();
     // window.open(document.getElementById('cvs').toDataURL(), 'new_window', 'width=310,height=30')
     // <img src="data:image/png;base64,iVBORw0KGgoAAAA ... ">
    ctx.clearRect(00,0,10000,5000);
    ctx2.clearRect(0,0,10000,5000);
    canvas[0][0].width = canvas[0][0].width
    canvas2[0][0].width = canvas[0][0].width
    ctx.save();
    canvas[0][0].img.src = dataURL
}

function changePointerLoc()
{
    var m = d3.mouse(canvas[0][0]);
    pointerLocation = m
    largeTheta=0
    smallTheta=0
    l = false
}

function addData()
{  
    // largeCircleR = get('largeR')
    smallCircleR = get('smallR')
    tinyCircleR = get('tinyR')
    var largeOmega = get('speed');
    if (largeOmega == 0)
    {
        return(0)
    }
    // calculate the next x and y coordinates of the line
    x           = xScale.invert(pointerLocation[0])+smallCircleR*Math.sin(smallTheta)+tinyCircleR*Math.sin(tinyTheta),
    y           = yScale.invert(pointerLocation[1])+smallCircleR*Math.cos(smallTheta)+tinyCircleR*Math.cos(tinyTheta);

    rectco      = {x:x,y:y},
    polco       = cartToPol(rectco);
    polco.theta +=largeTheta,
    theta       = polco.theta,
    rectco      = polToCart(polco),
    x           = xScale(rectco.x),
    y           = yScale(rectco.y),

    // draw line
    ctx2.strokeStyle = lineColor,
    ctx2.lineWidth   = lineWidth;
    if (l)
    {
        ctx2.lineTo(x,y);
    }

    if (!l)
    {
        ctx2.moveTo(x,y);
    }

    ctx2.stroke();

    tinyOmega = (canvasWidth/2)*largeOmega/tinyCircleR
    smallOmega = (canvasWidth/2)*largeOmega/smallCircleR
    // tinyOmega = 0
    // console.log(tinyOmega)
    // smallOmega = (canvasWidth/2)*largeOmega/smallCircleR
    // advance line arround small and big circle
    tinyTheta     += tinyOmega
    smallTheta    += smallOmega
    largeTheta    -= largeOmega
    rotationAngle += largeOmega
    largeTheta     = largeTheta%360
    l              = true

    // rotate the canvas
    canvas[0][0].width = canvas[0][0].width
    ctx.save();
    ctx.translate( canvas[0][0].width/2, canvas[0][0].height/2 );
    ctx.rotate(-rotationAngle);
    ctx.translate( -canvas[0][0].width/2, -canvas[0][0].height/2 );    
    ctx.drawImage(canvas2[0][0], 0,0);

}

//  ----- conversions ----- 
    function polToCart(coordinates)
    {
        r              = coordinates.r
        theta          = coordinates.theta
        x              = r*Math.cos(theta)
        y              = r*Math.sin(theta)
        newCoordinates = {x:x,y:y}
        return(newCoordinates)
    }

    function cartToPol(coordinates)
    {
        x              = coordinates.x
        y              = coordinates.y
        r              = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
        theta          = Math.atan2(y,x)
        newCoordinates = {r:r,theta:theta}
        return(newCoordinates)
    }

    var xScale = d3.scale.linear()
        .domain([-canvasWidth/2,canvasWidth/2])
        .range([0,canvasWidth])

    var yScale = d3.scale.linear()
        .domain([-canvasHeight/2,canvasHeight/2])
        .range([canvasHeight,0])


window.setInterval(addData,1)

function openClose(el){
    el = document.getElementById(el)
    if (el.className.indexOf("down") == -1)
    {
        el.className += ' down'
    }

    else if (el.className.indexOf("down") != -1)
    {
        el.className = el.className.replace(/ down/g, '')
    }
}
