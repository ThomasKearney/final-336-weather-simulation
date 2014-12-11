/**
* WeatherSim.js
* Simulates percipitation in three.js
* @author Thomas Kearney
*/

var camera;

//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
	if (event.which == null) {
	 return String.fromCharCode(event.keyCode) // IE
	} else if (event.which!=0 && event.charCode!=0) {
	 return String.fromCharCode(event.which)   // the rest
	} else {
	 return null // special key
	}
}

function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;
  
  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-0.1);
    return true;
  case 'a':
    c.translateX(-0.1);
    return true;
  case 's':
    c.translateZ(0.1);
    return true;
  case 'd':
    c.translateX(0.1);
    return true;
  case 'r':
    c.translateY(0.1);
    return true;
  case 'f':
    c.translateY(-0.1);
    return true;
  case 'S':
    c.fov = Math.min(80, c.fov + 5);
    c.updateProjectionMatrix();
    return true;
  case 'W':
    c.fov = Math.max(5, c.fov - 5);
    c.updateProjectionMatrix();
    return true;

    // alternates for arrow keys
  case 'J':
    //this.orbitLeft(5, distance)
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance)
    return true;
  case 'L':
    //this.orbitRight(5, distance)  
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance)
    return true;
  case 'I':
    //this.orbitUp(5, distance)      
    c.translateZ(-distance);
    c.rotateX(-5 * Math.PI / 180);
    c.translateZ(distance)
    return true;
  case 'K':
    //this.orbitDown(5, distance)  
    c.translateZ(-distance);
    c.rotateX(5 * Math.PI / 180);
    c.translateZ(distance)
    return true;
  }
  return false;
}

function handleKeyPress(event)
{
  var ch = getChar(event);
  if (cameraControl(camera, ch)) return;
}


function start() {

	window.onkeypress = handleKeyPress;

	var scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, 1.5, 0.1, 1000 );
	camera.position.x = 2;
	camera.position.y = 2;
	camera.position.z = 300;
	camera.lookAt(new THREE.Vector3(0,0,0));

	var ourCanvas = document.getElementById('theCanvas');
	var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
	renderer.setClearColor(0x000000);

	// create particle variables
	var particleCount = 1800;
	var geometry = new THREE.Geometry();
	var pMaterial = new THREE.PointCloudMaterial({
		color: 0xffffff,
		size: 20,
		map: THREE.ImageUtils.loadTexture('../images/particle.png'),
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	// create individual geometry
	for( p=0; p < particleCount; p++ ){
		var pX = Math.random() * 500 - 250;
		var pY = Math.random() * 500 - 250; 
		var pZ = Math.random() * 500 - 250;
		var particle = new THREE.Vector3(pX, pY, pZ);

		particle.velocity = new THREE.Vector3( 0, -Math.random(), 0 );

		// add to geometry
		geometry.vertices.push(particle);
	}

	// create system
	var particleSystem = new THREE.PointCloud( geometry, pMaterial );

	// add to scene
	scene.add(particleSystem);


  function updateParticleSystem() {

  var geometry = particleSystem.geometry;
  var vertices = geometry.vertices;
  var numVertices = vertices.length;
  var speedY = 1;

  for(var i = 0; i < numVertices; i++) {
    var v = vertices[i];

    if( v.y > -200 ){
      v.y -= speedY * Math.random();
    } else {
      v.y = 200;
    }
  }

  geometry.verticesNeedUpdate = true;

  }

	var render = function() {
		requestAnimationFrame(render);

		// adds animation to geometry
		particleSystem.rotation.y += 0.001;

    updateParticleSystem();

		// draw!
		renderer.render(scene, camera);
	};

	render();
}