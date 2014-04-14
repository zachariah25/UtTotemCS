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

var cloudParticleRadius = 4,
	numCloudParticles   = 500,
	cloudParticles      = [],
	cloudColor          = "rgba(255,255,255,.4)",
	svgHeight           = Math.max(500, innerHeight)-50,
	svgWidth     	    = Math.max(960, innerWidth)-50,	
	iterTime			= 10,//length of an iteration cycle in ms
	rayWidth            = 2,
	rayColor            = "rgba(255,250,205,.6)",
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
    .interpolate("none");


// this creates the cloud
	// add desired number of particles to cloud array
	for (var i = 0; i < numCloudParticles; i++) 
	{
		x = Math.random()*svgWidth/3+svgWidth/3
		y = Math.random()*svgHeight/3+svgHeight/3
		cloudParticles.push([x,y])
	};

	// add a particle to the svg for each particle in the array
	svg.selectAll("circle")
		.data(cloudParticles)
		.enter()
		.append("circle")
		.attr("cx",function(d){return(d[0])})
		.attr("cy",function(d){return(d[1])})
		.attr("r",cloudParticleRadius)
		.attr("fill",cloudColor);// offwhite cloud

// add new light ray
function addRay() {

	// gets current mouse locvation on the svg
	var m = d3.mouse(this);

	// adds new ray info to data array
	rayData.push(
		{
			lineData:
			[
				{x:m[0],y:m[1]},
				{x:m[0],y:m[1]+10}
			],
			origin:
			{x:m[0],y:m[1]},
			class:'activeRay',
			color:'rgba(255,255,255,.5)',
			refract:true
		})
	svg.selectAll(".activeRay")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("path")
		.attr("fill", "none")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)})
		.attr("stroke-width",rayWidth)
		.attr("stroke",function(d){return(d.color)});
}

function refract(origin,angle,increment,color)
{
	polCoords = {r: cloudParticleRadius*2,theta:angle+increment}
	cartCoords = polToCart(polCoords)
	cartCoords.x+=origin.x
	cartCoords.y+=origin.y

	rayData.push({lineData:[{x:origin.x,y:origin.y},{x:cartCoords.x,y:cartCoords.y+.0001}],origin:{x:origin.x,y:origin.y},class:'activeRay',color:color,refract:false})
	svg.selectAll(".activeRay")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("path")
		.attr("fill", "none")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)})
		.attr("stroke-width",rayWidth)
		.attr("stroke",rayColor);
}



// draw updated line
function replot()
{

	// loop through all light rays
	for (var i = rayData.length - 1; i >= 0; i--)
	{
		amnfdg = true

		var len  = rayData[i].lineData.length-1,
			rayX = rayData[i].lineData[len].x,
			rayY = rayData[i].lineData[len].y;
			
			
		// loop through all cloud particles
		for (var j = cloudParticles.length -1; j>=0 ;j--) 
		{
			var cloudParticleX = cloudParticles[j][0],
				cloudParticleY = cloudParticles[j][1],
				xSeperation    = Math.abs(rayX-cloudParticleX),
				ySeperation    = Math.abs(rayY-cloudParticleY);

			

			if (xSeperation<cloudParticleRadius && ySeperation<cloudParticleRadius)
			{
				rayData[i].origin = {x:rayX,y:rayY}
				center = rayData[i].origin

				polCoords = {r:.1,theta:0}
				polCoords.theta=Math.random()*tau
				// polCoords.theta=.8
				polCoords.r+=cloudParticleRadius*2.5
				cartCoords = polToCart(polCoords)
				cartCoords.x+=center.x
				cartCoords.y+=center.y


				rayData[i].lineData.push(cartCoords)
				if (rayData[i].refract)
				{
					// rayData[i].lineData.splice(0,len-1)
			  		// rayData[i].class = 'inactive'
			  		rayData[i].refract = false
					refract(center,polCoords.theta,tau/500,"rgba(255,0,0,.2)")
					refract(center,polCoords.theta,2*tau/500,"rgba(255,127,0,.2)")
					refract(center,polCoords.theta,3*tau/500,"rgba(255,255,0,.2)")
					refract(center,polCoords.theta,4*tau/500,"rgba(0,255,0,.2)")
					refract(center,polCoords.theta,5*tau/500,"rgba(0,0,255,.2)")
					refract(center,polCoords.theta,6*tau/500,"rgba(75,0,255,.2)")
				}
				amnfdg = false


			}

			// var len  = rayData[i].lineData.length-1;
			center = rayData[i].origin
			x = rayX-center.x
			y = rayY-center.y
			polCoords = cartToPol({x:x,y:y})
			if (amnfdg)
			{polCoords.r+=raySpeed;amnfdg = true}
			
			cartCoords = polToCart(polCoords)
			cartCoords.x+=center.x
			cartCoords.y+=center.y
			rayData[i].lineData[len] = cartCoords
		};



		

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
		.attr("class",function(d){return(d.class)})
		.attr("stroke",function(d){return(d.color)});//this actualy changes the class
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