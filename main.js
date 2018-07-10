
//import Avatar from './Avatar.js';
//import getBox from './getBox.js';

function init() {
  
  var scene = new THREE.Scene();
  var gui = new dat.GUI();
  var clock = new THREE.Clock();

  var enableFog = true;
  if(enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.005);
  }

  var box = getBox(1,1,1);
  //box.position.y = box.geometry.parameters.height/2;

  var planeMaterial = getMaterial('phong', 0xebdcb5);
  var plane = getPlane(planeMaterial, 200, 200);
  plane.name = 'plane-1';
  plane.castShadow = true;
  plane.receiveShadow = true;
  // manipulate objects
  plane.rotation.x = Math.PI / 2;
  //plane.rotation.z = Math.PI / 4;

  var spotLight = getDirectionalLight(1);
  spotLight.position.x = 88;
  spotLight.position.y = 75;
  spotLight.position.z = -50;
  spotLight.intensity = 1.3;

  //var helper = new THREE.DirectionalLightHelper(spotLight, 5);
  //scene.add(helper);

  var ambientLight = getAmbientLight(10);

  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  scene.add(hemisphereLight);

  //var helper = new THREE.CameraHelper(spotLight.shadow.camera);

  gui.add(spotLight, 'intensity', 0, 10).name('Light Intensity');
  gui.add(spotLight.position, 'x', 0, 100).name('Light Position x');
  gui.add(spotLight.position, 'y', 0, 100).name('Light Position y');
  gui.add(spotLight.position, 'z', -20, 20).name('Light Position z');
  gui.add(spotLight.rotation, 'y', -20, 20).name('Light Position z');

  var sphere = getSphere(0.05, 24, 24);

  //var boxGrid = getBoxGrid(20, 5, 8); //This looks like a bunch of structures piled together
  var boxGrid = getBoxGrid(20, 8, 2);
  boxGrid.name = 'boxGrid';

  //var avatar = showAvatar();

  //avatar.position.set(0, 5, 0);

  //scene.add(avatar);

  scene.add(plane);
  spotLight.add(sphere);
  scene.add(spotLight);
  scene.add(boxGrid);
  //scene.add(helper);
  //scene.add(ambientLight);
  //Camera
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 0;
  camera.position.y = 40;
  camera.position.z = 100;
  //camera.lookAt( new THREE.Vector3(0, 0, 0));
  //avatar.add(camera);


  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.shadowMap.enabled = true;//We need to enable shadow here as we as in the scene elements (plane and box).
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');
  renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('webgl').appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableKeys = false;

  //Avatar Stuff
  var marker = new THREE.Object3D();
  scene.add(marker);

  //Body
  var body = new THREE.CylinderGeometry(3, 2, 4, 20);
  var cover = new THREE.MeshNormalMaterial();
  var avatar = new THREE.Mesh(body, cover);
  avatar.name = 'body';
  marker.add(avatar);

  //Head
  var shape = new THREE.SphereGeometry(2);
  var head = new THREE.Mesh(shape, cover);
  head.position.set(0, 4, 0);
  //head.name('head');
  avatar.add(head);

  //Hat 
  var shape = new THREE.CylinderGeometry(1, 3, 3, 20);
  var hat = new THREE.Mesh(shape, cover);
  hat.position.set(0, 6, 0);
  hat.rotation.x = -0.2;
  //hat.rotation.z = 0.4;
  avatar.add(hat);

  //Right Hand
  var hand = new THREE.CylinderGeometry(1, 0.5, 3);
  var rightHand = new THREE.Mesh(hand, cover);
  rightHand.position.set(-4, 0, 0);
  rightHand.name = 'rightHand';
  avatar.add(rightHand);

  //Left Hand
  var leftHand = new THREE.Mesh(hand, cover);
  leftHand.position.set(4, 0, 0);
  leftHand.name = 'leftHand';
  avatar.add(leftHand);

  //Right Foot
  var rightFoot = new THREE.Mesh(hand, cover);
  rightFoot.position.set(-3, -4, 0);
  rightFoot.name = 'rightFoot';
  avatar.add(rightFoot);

  //Left Foot
  var leftFoot = new THREE.Mesh(hand, cover);
  leftFoot.position.set(3, -4, 0);
  leftFoot.name = 'leftFoot';
  avatar.add(leftFoot);

  marker.add(camera);
  marker.position.set(0, 5, 0);
  //End Avatar Stuff  

  var limbsSpeed = 7;
  var limbsDistance = 3;
  function walk() {
    if (!isWalking()) return;
    var position = Math.sin(clock.getElapsedTime() * limbsSpeed) * limbsDistance;

    rightHand.position.z = -position;
    leftHand.position.z = position;
    leftFoot.position.z = -position;
    rightFoot.position.z = position;
  }

  var isMovingRight;
  var isMovingLeft;
  var isMovingForward;
  var isMovingBack;

  function isWalking() {
    if (isMovingRight) return true;
    if (isMovingLeft) return true;
    if (isMovingForward) return true;
    if (isMovingBack) return true;
    return false;
  }

  function turn() {
    //var direction = camera.getWorldDirection( avatar);
    var direction = avatar.rotation.y;
    //var direction = 0;
    if (isMovingForward) direction = Math.PI;
    if (isMovingBack) direction = 0;
    if (isMovingRight) direction = Math.PI / 2;
    if (isMovingLeft) direction = -Math.PI / 2;

    //avatar.rotation.y = direction;
    spinAvatar(direction);
  }

  //Spin function
  function spinAvatar(direction) {
    new TWEEN
      .Tween({
        y: avatar.rotation.y
      })
      .to({
        y: direction
      }, 0.1)
      .onUpdate(function () {
        avatar.rotation.y = this.y;
      })
      .start();
    //console.log(direction)
  }

  //Avatar Moves
  var walkingSpeed = 2;
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    //console.log(e)

    //if (code === 32) jump();

    if (code === 37) {
      marker.position.x = marker.position.x - walkingSpeed; //left
      isMovingLeft = true;
    }
    if (code === 38 || code === 33) {
      marker.position.z = marker.position.z - walkingSpeed; //up
      isMovingForward = true;
    }
    if (code === 39) {
      marker.position.x = marker.position.x + walkingSpeed; //right
      isMovingRight = true;
    }
    if (code === 40) {
      marker.position.z = marker.position.z + walkingSpeed; //down
      isMovingBack = true;
    }
    // if (code === 67) isCartWheeling = true; // C
    // if (code === 70) isFlipping = true; // F

    //Detect Collisions
    // if (detectCollisions()) {
    //   if (isMovingLeft) marker.position.x = marker.position.x + 30;
    //   if (isMovingRight) marker.position.x = marker.position.x - 30;
    //   if (isMovingForward) marker.position.z = marker.position.z + 30;
    //   if (isMovingBack) marker.position.z = marker.position.z - 30;
    // }
  });

  document.addEventListener('keyup', function (e) {
    //console.log(e)
    var code = e.keyCode;
    if (code === 37) {
      isMovingLeft = false;
    }
    if (code === 38 || code === 33) {
      isMovingForward = false;
    }
    if (code === 39) {
      isMovingRight = false;
    }
    if (code === 40) {
      isMovingBack = false;
    }
    //if (code === 67) isCartWheeling = false; // C
    //if (code === 70) isFlipping = false; // F
  });

  var tree = makeTreeAt(5, 0, 2);
  scene.add(tree);

  update(renderer, scene, camera, controls, clock, walk, turn);

  return scene;
}

//Functions
var notAllowed = [];
function makeTreeAt(x, z, scale) {
  var trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(scale * 1, scale * 1, scale * 10),
    new THREE.MeshPhongMaterial({
      color: 0xA0522D
    })
  );
  var top = new THREE.Mesh(
    new THREE.OctahedronGeometry(scale * 5, scale * 1),
    //new THREE.IcosahedronGeometry(150, 1),
    new THREE.MeshPhongMaterial({
      color: 0x228B22,
      //flatShading: true,
      shading: THREE.FlatShading
    })
  );

  top.castShadow = true;
  top.receiveShadow = true;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  

  top.position.y = scale * 9;
  trunk.add(top);

  //Boundaries
  // var boundary = new THREE.Mesh(
  //   new THREE.CircleGeometry(200, 20),
  //   new THREE.MeshNormalMaterial()
  // );
  // boundary.position.y = -100;
  // boundary.rotation.x = -Math.PI / 2;
  // trunk.add(boundary);
  // notAllowed.push(boundary);

  trunk.position.set(x, 3, z);
  //scene.add(trunk);
  return trunk;
  //return top;
}

function getBox(w, h, d) {
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({
    //color: 0xeb61ce
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function getBoxGrid(amount, separationMultiplier, scale) {
  var group = new THREE.Group();
  var randomColor;

  for (var i = 0; i < amount; i++) {
    var obj = getBox(scale * 1, (scale * 2) * (Math.random() * 1), scale *1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    // randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    // obj.material.color = new THREE.Color(randomColor);
    // console.log(obj.material);
    // console.log(randomColor);
    group.add(obj);
    for (var j = 1; j < amount; j++) {
      var obj = getBox(scale * 1, (scale * 2) * (Math.random() * 1), scale * 1);
      // obj.material.color = new THREE.Color(randomColor);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }

  group.children.forEach(item => {
    randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    item.material.color = new THREE.Color(randomColor);
  });
  //console.log(group.children);

  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;

  return group;
}

function getPlane(material, size, segments) {
  var geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  //var geometry = new THREE.CircleGeometry(size, segments);
  material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
  obj.receiveShadow = true;
  obj.castShadow = true;
  obj.wireframe = true;

  return obj;
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

function getSpotLight(intensity) {
  var light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  return light;
}

function getDirectionalLight(intensity) {
  var light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -200;
  light.shadow.camera.bottom = -200;
  light.shadow.camera.right = 200;
  light.shadow.camera.top = 200;
  light.shadow.mapSize.width = 4095;
  light.shadow.mapSize.height = 4095;
  return light;
}

function getAmbientLight(intensity) {
  var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);
 
  return light;
}

function getSphere(size, width, height) {
  var geometry = new THREE.SphereGeometry(size, width, height);
  var material = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)'
  });

  var mesh = new THREE.Mesh(
    geometry,
    material
  );
  return mesh;
}

function getMaterial(type, color) {
  var selectedMaterial;
  var materialOptions = {
    color: color === undefined ? 'rgb(255, 255, 255)' : color,
    //wireframe: true,
  };

  switch (type) {
    case 'basic':
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
    case 'lambert':
      selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
      break;
    case 'phong':
      selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
      break;
    case 'standard':
      selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
      break;
    default:
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
      break;
  }

  return selectedMaterial;
}

function showAvatar() {
  var marker = new THREE.Object3D();
  //scene.add(marker);

  //Body
  var body = new THREE.CylinderGeometry(3, 2, 4, 20);
  var cover = new THREE.MeshNormalMaterial();
  var avatar = new THREE.Mesh(body, cover);
  avatar.name = 'body';
  marker.add(avatar);

  //Head
  var shape = new THREE.SphereGeometry(2);
  var head = new THREE.Mesh(shape, cover);
  head.position.set(0, 4, 0);
  //head.name('head');
  avatar.add(head);

  //Hat 
  var shape = new THREE.CylinderGeometry(1, 3, 3, 20);
  var hat = new THREE.Mesh(shape, cover);
  hat.position.set(0, 6, 0);
  hat.rotation.x = -0.2;
  //hat.rotation.z = 0.4;
  avatar.add(hat);

  //Right Hand
  var hand = new THREE.CylinderGeometry(1, 0.5, 3);
  var rightHand = new THREE.Mesh(hand, cover);
  rightHand.position.set(-4, 0, 0);
  rightHand.name = 'rightHand';
  avatar.add(rightHand);

  //Left Hand
  var leftHand = new THREE.Mesh(hand, cover);
  leftHand.position.set(4, 0, 0);
  leftHand.name = 'leftHand';
  avatar.add(leftHand);

  //Right Foot
  var rightFoot = new THREE.Mesh(hand, cover);
  rightFoot.position.set(-3, -4, 0);
  rightFoot.name = 'rightFoot';
  avatar.add(rightFoot);

  //Left Foot
  var leftFoot = new THREE.Mesh(hand, cover);
  leftFoot.position.set(3, -4, 0);
  leftFoot.name = 'leftFoot';
  avatar.add(leftFoot);

  return marker;
}


//UPDATE function
function update(renderer, scene, camera, controls, clock, walk, turn) {
  
  walk();
  turn();
  controls.update();
  TWEEN.update();

  var timeElapsed = clock.getElapsedTime();

  var plane = scene.getObjectByName('plane-1');
  var planeGeo = plane.geometry;
  planeGeo.vertices.forEach((vertex, index) => {
    vertex.z = Math.random();
    //vertex.z += Math.sin(elapsedTime + index * 0.1 + Math.random()) * 0.005;
  });
  //planeGeo.verticesNeedUpdate = true;


  var boxGrid = scene.getObjectByName('boxGrid');
  boxGrid.children.forEach(function (child, index) {
    var x = timeElapsed + index;
   //child.scale.y = (Math.sin(timeElapsed * 5 + index) + 1) / 2 + 0.001;// Add 0.001 so it doens't go all the way to 0 and look glitchy
    //child.scale.y = (noise.simplex2(x,x) + 1) / 2 + 0.001;
    child.position.y = child.scale.y / 2;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls, clock, walk, turn);
  });
}


var scene = init();