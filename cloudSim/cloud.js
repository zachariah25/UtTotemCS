/*
(C) 2014 Jackson Henry


????????????????????



*/

var cloudParticleRadius = 8,
	aparantRadius       = 3*cloudParticleRadius;
	numCloudParticles   = 300,
	cloudParticles      = [],
	cloudColor          = "rgba(255,255,255,.4)",
	svgHeight           = Math.max(500, innerHeight),
	svgWidth     	    = Math.max(960, innerWidth),	
	iterTime			= 10,//length of an iteration cycle in ms
	rayWidth            = 7,
	rayColor            = "rgba(255,255,255,.5)",
	rayData             = [],//data for each lightray
	tau                 = 2*Math.PI,//used for conversion and polar coordinates
	dTheta              = tau/40,
	svg                 = d3.select("#cloudSim")// add the svg element to body
							// .attr("width" , svgWidth)
							// .attr("height", svgHeight)// send down a light ray on click
							.on  ("click" , function() 
								{
									var m = d3.mouse(this);// gets current mouse locvation on the svg
									origin = {x:m[0],y:m[1]}
									addRay(origin,tau/4,10,rayColor,true)
								});


var lineFunction = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis");

svg.append("circle")
	.attr("cx", svgWidth/2)
	.attr("cy", 0)
	.attr("r", 100)
	.attr('id','sun')
	.style("fill", "#FFCC00");


// this creates the cloud
// add desired number of particles to cloud array
	for (var i = 0; i < Math.floor(numCloudParticles/3); i++) 
	{
		r     = Math.random()*250
		theta = Math.random()*tau
		cart  = polToCart({r:r,theta:theta})
		cloudParticles.push([cart.x+svgWidth/2,cart.y+svgHeight/2])
	};

	for (var i = 0; i < Math.floor(numCloudParticles/3); i++) 
	{
		r     = Math.random()*200
		theta = Math.random()*tau
		cart  = polToCart({r:r,theta:theta})
		cloudParticles.push([cart.x+svgWidth/3,cart.y+svgHeight/2])
	};

	for (var i = 0; i < Math.floor(numCloudParticles/3); i++) 
	{
		r     = Math.random()*200
		theta = Math.random()*tau
		cart  = polToCart({r:r,theta:theta})
		cloudParticles.push([cart.x+2*svgWidth/3,cart.y+svgHeight/2])
	};

// add a particle to the svg for each particle in the array
svg.selectAll("circle")
	.data(cloudParticles)
	.enter()
	.append("circle")
	.attr("cx",function(d){return(d[0])})
	.attr("cy",function(d){return(d[1])})
	.attr("r",aparantRadius)
	.attr('class','cloud')
	.attr("fill",cloudColor);


function addRay(origin,angle,r,color,refract)
{
	polCoords     = {r:r,theta:angle}
	cartCoords    = polToCart(polCoords)
	cartCoords.x += origin.x
	cartCoords.y +=origin.y

	rayData.push(
		{
			lineData:
			[
				origin,
				origin,
				cartCoords
			],
			origin  : origin,
			class   :'activeRay',
			color   : color,
			refract : refract
		})

	svg.selectAll(".activeRay")
		.data(rayData)// associate all lines with a value in the rayData array
		.enter()// d3 magic
		.append("path")
		.attr("fill", "none")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("class",function(d){return(d.class)})
		.attr("stroke-width",get('rayWidth'))
		.attr("stroke",function(d){return(d.color)});
};

function get(el)
{
	return(parseInt(document.getElementById(el).value))
}
function refract(origin,theta,dTheta)
{
	addRay(origin , theta+dTheta   , cloudParticleRadius*2 ,"rgba(255,0,0,.25)"   , false)
	addRay(origin , theta+2*dTheta , cloudParticleRadius*2 ,"rgba(255,127,0,.25)" , false)
	addRay(origin , theta+3*dTheta , cloudParticleRadius*2 ,"rgba(255,255,0,.25)" , false)
	addRay(origin , theta+4*dTheta , cloudParticleRadius*2 ,"rgba(0,255,0,.25)"   , false)
	addRay(origin , theta+5*dTheta , cloudParticleRadius*2 ,"rgba(0,0,255,.25)"   , false)
	addRay(origin , theta+6*dTheta , cloudParticleRadius*2 ,"rgba(143,0,255,.25)" , false)
}

function sun(frequency)
{
	randomInt = Math.random()
	if (randomInt<=get('sunyness')/50)
	{
	
		var origin = {x:svgWidth/2,y:0}
		theta = Math.random()*tau/2
		addRay(origin,theta,.01,rayColor,true)
	}
}

function replot()
{
	sun(.01)

	// loop through all light rays
	for (var i = rayData.length - 1; i >= 0; i--)
	{
		hasNotColided = true

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
				hasNotColided     = false
				rayData[i].origin = {x:rayX,y:rayY}
				center            = rayData[i].origin
				polCoords         = {r:.1,theta:0}
				polCoords.theta   = Math.random()*tau
				polCoords.r      += cloudParticleRadius*2.5
				cartCoords        = polToCart(polCoords)
				cartCoords.x     += center.x
				cartCoords.y     += center.y

				rayData[i].lineData.push(cartCoords)

				if (rayData[i].refract)
				{
					rayData[i].color = 'rgba(0,0,0,0)'
					refract(center,polCoords.theta,dTheta)
			  		rayData[i].refract = false
				}
			}

			// var len  = rayData[i].lineData.length-1;
			center = rayData[i].origin
			x = rayX-center.x
			y = rayY-center.y
			polCoords = cartToPol({x:x,y:y})
			if (hasNotColided)
			{
				ds = get('raySpeed')
				polCoords.r+=ds;
				hasNotColided = true
			}
			cartCoords = polToCart(polCoords)
			cartCoords.x+=center.x
			cartCoords.y+=center.y
			rayData[i].lineData[len] = cartCoords
		};

		// if the rayhits the bottom of the svg then leave it there as a little marker (color observation)
		if (rayY>svgHeight || rayY<0 || rayX>svgWidth || rayX<0)
		{
			collectLightRay(rayData[i],i)
			svg.selectAll('.inactive').remove()
		  
		}
	}


	// update svg with new data
	svg.selectAll(".activeRay")
		.attr("d", function(d){return(lineFunction(d.lineData))})
		.attr("stroke", function(d){return(d.color)})
		.attr("stroke-width",get('rayWidth'))
		.attr("class",function(d){return(d.class)});

	svg.selectAll("#sun").remove()
	svg.append("circle")
	.attr("cx", svgWidth/2)
	.attr("cy", 0)
	.attr("r", 100)
	.attr('id','sun')
	.style("fill", "#FFCC00");
};

function collectLightRay(ray,i)
{
	ray.lineData = [{x:0,y:0},{x:0,y:0}]
	ray.class = 'inactive'
	rayData.splice(i,1);
}

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