import 'styles/index.scss';
import { map, distance, hexToRgbTreeJs } from './helpers';

export default class App {
  setup() {
    this.gui = new dat.GUI();
    this.backgroundColor = '#212d99';
    this.gutter = { size: 0 };
    this.meshes = [];
    this.grid = { cols: 30, rows: 30 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.velocity = -.1;
    this.angle = 0;
    this.amplitude = .1;
    this.frequency = 0;
    this.waveLength = 200;
    this.ripple = {};
    this.radius = 1;
    this.interval = 0;
    this.waterDropPositions = [{
      x: -2,
      z: 1.8
    },
    {
      x: 1,
      z: -2
    },
    {
      x: 10,
      z: 8
    },
    {
      x: -11,
      z: -11
    },
    {
      x: 12,
      z: -13
    }];

    const gui = this.gui.addFolder('Background');

    gui.addColor(this, 'backgroundColor').onChange((color) => {
      document.body.style.backgroundColor = color;
    });

    window.addEventListener('resize', this.onResize.bind(this), { passive: true });

    window.addEventListener('visibilitychange', (evt) => {
      this.pause = evt.target.hidden;
    }, false);
  }

  addSoundControl() {
    this.sound = new Howl({
      src: 'https://iondrimbafilho.me/water-drop.mp3'
    });

    const muted = {
      true: () => this.soundIcon.classList.add('sound-icon--muted'),
      false: () => this.soundIcon.classList.remove('sound-icon--muted')
    };

    this.soundMuted = true;
    this.soundIcon = document.querySelector('.sound-icon');
    this.sound.mute(this.soundMuted);

    this.soundIcon.addEventListener('click', () => {
      this.soundMuted = !this.soundMuted;
      muted[this.soundMuted]();
      this.sound.mute(this.soundMuted);
    });

    muted[this.soundMuted]();
  }

  createScene() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(10, width / height, 1, 1000);
    this.camera.position.set(-180, 180, 180);

    this.scene.add(this.camera);
  }

  addAmbientLight() {
    const obj = { color: '#fff' };
    const light = new THREE.AmbientLight(obj.color, 1);

    this.scene.add(light);
  }

  addSpotLight() {
    const obj = { color: '#fff' };
    const light = new THREE.SpotLight(obj.color, 1);

    light.position.set(0, 50, 0);
    light.castShadow = true;

    this.scene.add(light);
  }

  addPointLight(color, position) {
    const pointLight = new THREE.PointLight(color, 1, 1000, 1);
    pointLight.position.set(position.x, position.y, position.z);

    this.scene.add(pointLight);
  }

  createGrid() {
    this.groupMesh = new THREE.Object3D();

    const meshParams = {
      color: '#fff',
      metalness: .3,
      emissive: '#000000',
      roughness: 1,
    };

    const material = new THREE.MeshPhysicalMaterial(meshParams);

    for (let row = 0; row < this.grid.rows; row++) {
      this.meshes[row] = [];

      for (let col = 0; col < this.grid.cols; col++) {
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const mesh = this.getMesh(geometry, material);
        mesh.position.y = 0;
        mesh.name = `cube-${row}-${col}`;

        const pivot = new THREE.Object3D();

        pivot.add(mesh);
        pivot.scale.set(1, 1, 1);
        pivot.position.set(col + (col * this.gutter.size), 0, row + (row * this.gutter.size));

        this.meshes[row][col] = pivot;

        this.groupMesh.add(pivot);
      }
    }

    const centerX = ((this.grid.cols) + ((this.grid.cols) * this.gutter.size)) * .4;
    const centerZ = ((this.grid.rows) + ((this.grid.rows) * this.gutter.size)) * .6;

    this.groupMesh.position.set(-centerX, 1, -centerZ);

    this.scene.add(this.groupMesh);
  }

  getMesh(geometry, material) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  addCameraControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  addFloor() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShadowMaterial({ opacity: .3 });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.name = 'floor';
    this.floor.position.y = -1;
    this.floor.rotateX(- Math.PI / 2);
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  addWaterDrop() {
    const meshParams = {
      color: '#24ddf7',
      metalness: .41,
      emissive: '#000000',
      roughness: 0,
    };

    const geometry = new THREE.BoxBufferGeometry(.5, 2, .5);
    const material = new THREE.MeshStandardMaterial(meshParams);

    const waterDrop = new THREE.Mesh(geometry, material);

    return waterDrop;
  }

  getRandomWaterDropPosition() {
    return this.waterDropPositions[Math.floor(Math.random() * Math.floor(this.waterDropPositions.length))];
  }

  animateWaterDrops() {
    this.interval = setInterval(() => {
      const waterDrop = this.addWaterDrop();
      const { x, z } = this.getRandomWaterDropPosition();

      waterDrop.position.set(x, 50, z);
      this.scene.add(waterDrop);

      if (this.pause) {
        this.scene.remove(waterDrop);
        TweenMax.killAll(true);
      } else {
        TweenMax.to(waterDrop.position, 1, {
          ease: Sine.easeIn,
          y: -2,
          onUpdate: () => {
            if (waterDrop.position.y < 1 && waterDrop.position.y > -1) {
              this.sound.play();
              this.radius = 1;
              this.motion = -1;
              this.ripple = {
                x,
                z,
              };
            }
          },
          onComplete: () => {
            waterDrop.position.set(0, 50, 0);
            this.scene.remove(waterDrop);
          }
        });
      }

    }, 1300);
  }

  draw() {
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const dist = distance(col, row, this.ripple.x - this.groupMesh.position.x, this.ripple.z - this.groupMesh.position.z);

        if (dist < this.radius) {
          const offset = map(dist, 0, -this.waveLength, -100, 100);

          const angle = this.angle + offset;

          const y = map(Math.sin(angle), -1, 0, this.motion > 0 ? 0 : this.motion, 0);

          this.meshes[row][col].position.y = y;
        }
      }
    }

    this.angle -= this.velocity * 2;
    this.radius -= this.velocity * 3;
    this.motion -= this.velocity / 5;
  }

  animate() {
    this.controls.update();

    this.draw();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.setup();

    this.addSoundControl();

    this.createScene();

    this.createCamera();

    this.addAmbientLight();

    this.addSpotLight();

    this.createGrid();

    this.addCameraControls();

    this.addFloor();

    this.animate();

    this.draw();

    this.animateWaterDrops();
  }
}
