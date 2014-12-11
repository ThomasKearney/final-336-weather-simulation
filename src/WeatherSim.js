/**
* WeatherSim.js
* Simulates percipitation in three.js
* @author Thomas Kearney
*/

var renderer,
    scene,
    camera,
    cameraRadius = 50.0,
    cameraTarget,
    cameraX = 50,
    cameraY = 0,
    cameraZ = cameraRadius - 20,
    particleSystem,
    particleSystemHeight = 100.0,
    clock,
    controls,
    parameters,
    onParametersUpdate,
    texture;

function handleKeyPress(event)
{
  var ch = getChar(event);
  if (cameraControl(camera, ch)) return;
}


function start() {

  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color( 0x000000 ) );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  cameraTarget = new THREE.Vector3( 0, 0, 0 );

  texture = THREE.ImageUtils.loadTexture( '../images/snow.png' );

	// create particle variables
	var particleCount = 10000,
    width = 100,
    height = particleSystemHeight,
    depth = 100,
    parameters = {
      color: 0xFFFFFF,
      height: particleSystemHeight,
      radiusX: 2.5,
      radiusZ: 2.5,
      size: 100,
      scale: 4.0,
      opacity: 0.4,
      speedH: 1.0,
      speedV: 1.0

  },
  geometry = new THREE.Geometry(),
  pMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color:  { type: 'c', value: new THREE.Color( parameters.color ) },
      height: { type: 'f', value: parameters.height },
      elapsedTime: { type: 'f', value: 0 },
      radiusX: { type: 'f', value: parameters.radiusX },
      radiusZ: { type: 'f', value: parameters.radiusZ },
      size: { type: 'f', value: parameters.size },
      scale: { type: 'f', value: parameters.scale },
      opacity: { type: 'f', value: parameters.opacity },
      texture: { type: 't', value: texture },
      speedH: { type: 'f', value: parameters.speedH },
      speedV: { type: 'f', value: parameters.speedV }

    },
    vertexShader: document.getElementById( 'WeatherSim_vs' ).textContent,
    fragmentShader: document.getElementById( 'WeatherSim_fs' ).textContent,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false
  });

	// create individual geometry
	for( p=0; p < particleCount; p++ ){

		var particle = new THREE.Vector3(
      rand( width ),
      Math.random() * height,
      rand( depth )
    );

		// add to geometry
		geometry.vertices.push(particle);
	}

	// create system
	particleSystem = new THREE.PointCloud( geometry, pMaterial );
  particleSystem.position.y = -height/2;

	// add to scene
	scene.add(particleSystem);

  clock = new THREE.Clock();

  document.body.appendChild( renderer.domElement );

  function rand( v ) {
    return (v * (Math.random() - 0.5));
  }

  var render = function() {

  	requestAnimationFrame(render);

    var delta = clock.getDelta();
    var elapsedTime = clock.getElapsedTime();

    particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;
    camera.position.set( cameraX, cameraY, cameraZ );
    camera.lookAt( cameraTarget );

    renderer.clear();
  	// draw!
  	renderer.render(scene, camera);
  };

	render();
}