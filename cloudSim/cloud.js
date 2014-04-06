/*
(C) 2014 Jackson Henry

General notes
=====================
1. change the data to be in polar coordinates for easy calculation (create conversion function)

2. different colors later

*/

var cloudParticleRadius = 20,
	numCloudParticles   = 100,
	cloudParticles      = [],
	svgHeight           = Math.max(500, innerHeight)-50,
	svgWidth     	    = Math.max(960, innerWidth)-50,	
	iterTime			= 1,//length of an iteration cycle in ms
	rayWidth            = 1,
	raySpeed			= 5,//ray speed in px per iteration
	rayData             = [],//data for each lightray
	tau                 = 2*Math.PI,//used for conversion and polar coordinates
	svg                 = d3.select("body").append("svg")// add the svg element to body
							.attr("width" , svgWidth)
							.attr("height", svgHeight)// send down a light ray on click
							.on  ("click" , addRay);


var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis");


// this creates the cloud
	// add desired number of particles to cloud array
	for (var i = 0; i < numCloudParticles; i++) 
	{
		x = [Math.random()*svgWidth/2+svgWidth/4]
		y = [Math.random()*svgHeight/2+svgHeight/4]
		cloudParticles.push([x,y])
	};

	// add a particle to the svg for each particle in the array
	svg.selectAll("circle")
		.data(cloudParticles)
		.enter()
		.append("circle")
		.attr("cx",function(d){return(d[0])})
		.attr("cy",function(d){return(d[1])})
		.attr("r",cloudParticleRadius)// offwhite cloud
		.attr("fill","rgba(255,255,255,.2)");

// add new light ray
function addRay() {
	// gets current mouse locvation on the svg
	var m = d3.mouse(this);

	// adds new ray info to data array
	rayData.push({lineData:[{x:m[0],y:m[1]},{x:m[0],y:m[1]+10}],class:'activeRay'})
	svg.selectAll(".activeRay")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("path")
		.attr("fill", "none")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)})
		.attr("stroke-width",rayWidth)
		.attr("stroke","#222");
}

// draw updated line
function replot()
{
	// loop through all light rays
	for (var i = rayData.length - 1; i >= 0; i--)
	{

		var len  = rayData[i].lineData.length-1
			rayX = rayData[i].lineData[0].x,
			rayY = rayData[i].lineData[len].y;
		// loop through all cloud particles
		for (var j = cloudParticles.length - 1; j >= 0; j--) 
		{
			var cloudParticleX = cloudParticles[j][0],
				cloudParticleY = cloudParticles[j][1],
				xSeperation = Math.abs(rayX-cloudParticleX),
				ySeperation = Math.abs(rayY-cloudParticleY);
			if (xSeperation<cloudParticleRadius && ySeperation<cloudParticleRadius)
			{
				
				rayData[i].lineData.push({x:rayX+(6-(rayX-cloudParticleX)*2),y:rayY+raySpeed})
			}
		};

		rayData[i].lineData[len].y+=raySpeed

		// if the rayhits the bottom of the svg then leave it there as a little marker (color observation)
		if (rayY>svgHeight)
		{
		  rayData[i].lineData[len-1].y=svgHeight-25
		  rayData[i].lineData.splice(0,len-1)
		  rayData[i].class = 'inactive'
		}

		// change the class data so it doesnt keep being looped over after it hits the bottom
		if (rayData[i].class == 'inactive')
		{
			rayData.splice(i,1);
		}
	}

	// update svg with new data
	svg.selectAll(".activeRay")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)});//this actualy changes the class
};


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
	theta          = Math.atan(y/x)
	newCoordinates = {r:r,theta:theta}
	return(newCoordinates)
}

var xScale = d3.scale.linear()
	.domain([-svgWidth/2,svgWidth/2])
	.range([0,svgWidth])

var yScale = d3.scale.linear()
	.domain([-svgHeight/2,svgHeight/2])
	.range([svgHeight,0])


window.setInterval(replot,iterTime)