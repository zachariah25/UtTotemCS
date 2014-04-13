/*
(C) 2014 Jackson Henry

General notes
=====================
1. increse effeciency

2. different colors
????????????????????

1. add sound on refract
2. change cloud shape


*/

var cloudParticleRadius = 6,
	numCloudParticles   = 800,
	cloudParticles      = [],
	svgHeight           = Math.max(500, innerHeight)-50,
	svgWidth     	    = Math.max(960, innerWidth)-50,	
	iterTime			= 1,//length of an iteration cycle in ms
	rayWidth            = 2,
	raySpeed			= 8,//ray speed in px per iteration
	rayData             = [],//data for each lightray
	tau                 = 2*Math.PI,//used for conversion and polar coordinates
	svg                 = d3.select("body").append("svg")// add the svg element to body
							.attr("width" , svgWidth)
							.attr("height", svgHeight)// send down a light ray on click
							.on  ("click" , addRay);


var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("qnone");


// this creates the cloud
	// add desired number of particles to cloud array
	for (var i = 0; i < numCloudParticles; i++) 
	{
		x = [Math.random()*svgWidth/3+svgWidth/3]
		y = [Math.random()*svgHeight/3+svgHeight/3]
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
		.attr("fill","rgba(255,255,255,.5)");
andf= 1
// add new light ray
function addRay() {
	if (andf ==1)
	{
		now = new Date().getTime() / 1000;
		andf=0
	}
	// gets current mouse locvation on the svg
	var m = d3.mouse(this);

	// adds new ray info to data array
	rayData.push({lineData:[{x:m[0],y:m[1]},{x:m[0],y:m[1]},{x:m[0],y:m[1]+10}],origin:{x:m[0],y:m[1]},class:'activeRay'})
	svg.selectAll(".activeRay")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("path")
		.attr("fill", "none")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)})
		.attr("stroke-width",rayWidth)
		.attr("stroke","rgba(255,250,205,.6)");
}

// draw updated line
function replot()
{
	// loop through all light rays
	for (var i = rayData.length - 1; i >= 0; i--)
	{

		var len  = rayData[i].lineData.length-1
			rayX = rayData[i].lineData[len].x,
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
				rayData[i].origin = {x:rayX,y:rayY}
				center = rayData[i].origin
				x = rayX-center.x
				y = rayY-center.y
				polCoords = cartToPol({x:x,y:y})

				polCoords.theta=Math.random()*tau
				polCoords.r+=cloudParticleRadius*2
				cartCoords = polToCart(polCoords)
				cartCoords.x+=center.x
				cartCoords.y+=center.y


				rayData[i].lineData.push(cartCoords)
				// an attempt at adding noise on collsions
			// oscillator = context.createOscillator();
			// oscillator.frequency.value = 500;
			// // oscillator.type = 4;
			// oscillator.connect(context.destination);
			// var seconds = new Date().getTime() / 1000;
			// oscillator.start(seconds-now);
			// oscillator.stop(seconds-now+.1)
			// // delete context


			}
		};

		center = rayData[i].origin
		x = rayX-center.x
		y = rayY-center.y
		polCoords = cartToPol({x:x,y:y})
		polCoords.r+=raySpeed
		cartCoords = polToCart(polCoords)
		cartCoords.x+=center.x
		cartCoords.y+=center.y
		rayData[i].lineData[len] = cartCoords
		// rayData[i].lineData[len].y+=raySpeed

		// if the rayhits the bottom of the svg then leave it there as a little marker (color observation)
		if (rayY>svgHeight || rayY<0 || rayX>svgWidth || rayX<0)
		{
		  rayData[i].lineData[len-1].y=svgHeight
		  rayData[i].lineData[len].y=svgHeight

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
	theta          = Math.atan2(y,x)
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
// try {
// 	// Fix up for prefixing
// 	window.AudioContext = window.AudioContext||window.webkitAudioContext;
// 		context = new AudioContext();
// 	}
// 	catch(e) {
// 		alert('Sorry, your browser doesnt support the "play" button :( \n try the latest firefox or chrome');
// 	}
// // ----- functions to listen to morse code -----
// 	// function to play a tone
// 	function note(start,length,freq){
// 		oscillator = context.createOscillator();
// 		oscillator.frequency.value = freq;
// 		// oscillator.type = 4;
// 		oscillator.connect(context.destination);
// 		oscillator.start(start);
// 		oscillator.stop(start+length)
// 		}