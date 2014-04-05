/*
(C) 2014 Jackson Henry

General notes
======================
1. consider giving the lines that havent gotten stuck to the bottom a seperate class to improve effeciency
2. Looking in to using d3.svg.line to do something similar to polyline to allow refraction
3. change the data to be in polar coordinates for easy calculation (create conversion function)

4. different colors later

*/

// temporary for testing
var cloudParticleRadius = 6,
	numCloudParticles   = 500,
	cloudParticles      = [],
	svgHeight           = Math.max(500, innerHeight)-50,
	svgWidth     	    = Math.max(960, innerWidth)-50,	
	iterTime			= 10,//length of an iteration cycle in ms
	raySpeed			= 2,//ray speed in px per iteration
	rayData             = [],//data for each lightray
	svg                 = d3.select("body").append("svg")// add the svg element to body
							.attr("width" , svgWidth)
							.attr("height", svgHeight)// send down a light ray on click
							.on  ("click" , addLine);

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
function addLine() {
	// gets current mouse locvation on the svg
	var m = d3.mouse(this);

	// adds new ray info to data array
	rayData.push({x1:m[0],y1:m[1],x2:m[0],y2:m[1]})
	svg.selectAll("line")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("line")
		.attr("x1",function(d){return(d.x1)})
		.attr("y1",function(d){return(d.y1)}) 
		.attr("x2",function(d){return(d.x2)})
		 .attr("y2",function(d){return(d.y2+10)}) 
		.attr("stroke-width",6)
		.attr("stroke","white");
}

// draw updated line
function replot()
{
	// loop through all light rays
	for (var i = rayData.length - 1; i >= 0; i--)
	{
		var rayX = rayData[i].x1,
			rayY = rayData[i].y2
		// loop through all cloud particles
		for (var j = cloudParticles.length - 1; j >= 0; j--) 
		{
			var cloudParticleX = cloudParticles[j][0],
				cloudParticleY = cloudParticles[j][1],
				xSeperation = Math.abs(rayX-cloudParticleX),
				ySeperation = Math.abs(rayY-cloudParticleY);
			if (xSeperation<cloudParticleRadius && ySeperation<cloudParticleRadius)
			{
				rayData[i].x1+=xSeperation
			}
		};

		rayData[i].y2+=raySpeed

		// if the rayhits the bottom of the svg then leave it there as a little marker (color observation)
		if (rayY>svgHeight)
		{
		  rayData[i].y1=svgHeight-25
		}
	}

	// update svg with new data
	svg.selectAll("line")
		.attr("x1",function(d){return(d.x1)})
		.attr("x2",function(d){return(d.x1)})
		.attr("y1",function(d){return(d.y1)})
		.attr("y2",function(d){return(d.y2)});
};

window.setInterval(replot,iterTime)