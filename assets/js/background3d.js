(function () {
  'use strict';

  var canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 16);

  var group = new THREE.Group();
  scene.add(group);

  var palette = [
    new THREE.Color('#8b5cf6'),
    new THREE.Color('#22d3ee'),
    new THREE.Color('#f472b6'),
    new THREE.Color('#a78bfa')
  ];

  var COUNT = reduced ? 320 : 900;
  var positions = new Float32Array(COUNT * 3);
  var colors = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    var r = 9 + Math.random() * 10;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 4;
    var c = palette[i % palette.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  var pMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var points = new THREE.Points(pGeo, pMat);
  group.add(points);

  var knotGeo = new THREE.TorusKnotGeometry(3.6, 1.05, 160, 24);
  var knotMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.16 });
  var knot = new THREE.Mesh(knotGeo, knotMat);
  knot.position.z = -6;
  group.add(knot);

  var ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(6.5, 0.035, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.25 })
  );
  ring1.position.z = -10;
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);

  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(8.2, 0.03, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.18 })
  );
  ring2.position.z = -11;
  ring2.rotation.x = Math.PI / 2.6;
  group.add(ring2);

  var mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function tick() {
    points.rotation.y += 0.0006;
    knot.rotation.x += 0.001;
    knot.rotation.y += 0.0016;
    ring1.rotation.z += 0.0004;
    ring2.rotation.z -= 0.0003;
    group.rotation.y += (mouse.x * 0.25 - group.rotation.y) * 0.04;
    group.rotation.x += (mouse.y * 0.18 - group.rotation.x) * 0.04;
    renderer.render(scene, camera);
  }

  function loop() {
    tick();
    if (!reduced) requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();