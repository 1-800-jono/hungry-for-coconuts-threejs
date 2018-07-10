export default function getBox(w, h, d) {
  var geometry = new THREE.BoxGeometry(w, h, d);
  var material = new THREE.MeshPhongMaterial({
    //color: 0xeb61ce
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}