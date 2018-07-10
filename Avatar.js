//Avatar Stuff
export default function Avatar() {
  //Merker
  var marker = new THREE.Object3D();

  //Body
  var body = new THREE.CylinderGeometry(3, 2, 4, 20);
  var cover = new THREE.MeshNormalMaterial();
  var avatar = new THREE.Mesh(body, cover);

  marker.add(avatar);

  //Head
  var shape = new THREE.SphereGeometry(2);
  var head = new THREE.Mesh(shape, cover);
  head.position.set(0, 4, 0);
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
  avatar.add(rightHand);

  //Left Hand
  var leftHand = new THREE.Mesh(hand, cover);
  leftHand.position.set(4, 0, 0);
  avatar.add(leftHand);

  //Right Foot
  var rightFoot = new THREE.Mesh(hand, cover);
  rightFoot.position.set(-3, -4, 0);
  avatar.add(rightFoot);

  //Left Foot
  var leftFoot = new THREE.Mesh(hand, cover);
  leftFoot.position.set(3, -4, 0);
  avatar.add(leftFoot);

  function walk(avatar) {
    if (!isWalking()) return;
    var clock = new THREE.Clock();

    var position = Math.sin(clock.getElapsedTime() * 9) * 50;
    
    avatar.rightHand.position.z = -position;
    avatar.leftHand.position.z = position;
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
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode;
    console.log(e)

    //if (code === 32) jump();

    if (code === 37) {
      avatar.position.x = avatar.position.x - 30; //left
      isMovingLeft = true;
    }
    if (code === 38 || code === 33) {
      avatar.position.z = avatar.position.z - 30; //up
      isMovingForward = true;
    }
    if (code === 39) {
      avatar.position.x = avatar.position.x + 30; //right
      isMovingRight = true;
    }
    if (code === 40) {
      avatar.position.z = avatar.position.z + 30; //down
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

  walk();
  
  return marker;
}

