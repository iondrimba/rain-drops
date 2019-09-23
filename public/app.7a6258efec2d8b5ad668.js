!function(e){var t={};function i(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=1)}([function(e,t,i){},function(e,t,i){"use strict";i.r(t);i(0);var n=function(e,t,i,n,o){return n+(e-t)/(i-t)*(o-n)};function o(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(new(function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,i,s;return t=e,(i=[{key:"setup",value:function(){var e=this;this.gui=new dat.GUI,this.backgroundColor="#212d99",this.gutter={size:0},this.meshes=[],this.grid={cols:30,rows:30},this.width=window.innerWidth,this.height=window.innerHeight,this.velocity=-.1,this.angle=0,this.amplitude=.1,this.frequency=0,this.waveLength=200,this.ripple={},this.radius=1,this.interval=0,this.waterDropPositions=[{x:-2,z:1.8},{x:1,z:-2},{x:10,z:8},{x:-11,z:-11},{x:12,z:-13}],this.gui.addFolder("Background").addColor(this,"backgroundColor").onChange(function(e){document.body.style.backgroundColor=e}),window.addEventListener("resize",this.onResize.bind(this),{passive:!0}),window.addEventListener("visibilitychange",function(t){e.pause=t.target.hidden},!1)}},{key:"addSoundControl",value:function(){var e=this;this.sound=new Howl({src:"https://iondrimbafilho.me/water-drop.mp3"});var t={true:function(){return e.soundIcon.classList.add("sound-icon--muted")},false:function(){return e.soundIcon.classList.remove("sound-icon--muted")}};this.soundMuted=!0,this.soundIcon=document.querySelector(".sound-icon"),this.sound.mute(this.soundMuted),this.soundIcon.addEventListener("click",function(){e.soundMuted=!e.soundMuted,t[e.soundMuted](),e.sound.mute(e.soundMuted)}),t[this.soundMuted]()}},{key:"createScene",value:function(){this.scene=new THREE.Scene,this.renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=THREE.PCFSoftShadowMap,document.body.appendChild(this.renderer.domElement)}},{key:"createCamera",value:function(){var e=window.innerWidth,t=window.innerHeight;this.camera=new THREE.PerspectiveCamera(10,e/t,1,1e3),this.camera.position.set(-180,180,180),this.scene.add(this.camera)}},{key:"addAmbientLight",value:function(){var e=new THREE.AmbientLight("#fff",1);this.scene.add(e)}},{key:"addSpotLight",value:function(){var e=new THREE.SpotLight("#fff",1);e.position.set(0,50,0),e.castShadow=!0,this.scene.add(e)}},{key:"addPointLight",value:function(e,t){var i=new THREE.PointLight(e,1,1e3,1);i.position.set(t.x,t.y,t.z),this.scene.add(i)}},{key:"createGrid",value:function(){this.groupMesh=new THREE.Object3D;for(var e=new THREE.MeshPhysicalMaterial({color:"#fff",metalness:.3,emissive:"#000000",roughness:1}),t=0;t<this.grid.rows;t++){this.meshes[t]=[];for(var i=0;i<this.grid.cols;i++){var n=new THREE.BoxBufferGeometry(1,1,1),o=this.getMesh(n,e);o.position.y=0,o.name="cube-".concat(t,"-").concat(i);var s=new THREE.Object3D;s.add(o),s.scale.set(1,1,1),s.position.set(i+i*this.gutter.size,0,t+t*this.gutter.size),this.meshes[t][i]=s,this.groupMesh.add(s)}}var r=.4*(this.grid.cols+this.grid.cols*this.gutter.size),a=.6*(this.grid.rows+this.grid.rows*this.gutter.size);this.groupMesh.position.set(-r,1,-a),this.scene.add(this.groupMesh)}},{key:"getMesh",value:function(e,t){var i=new THREE.Mesh(e,t);return i.castShadow=!0,i.receiveShadow=!0,i}},{key:"addCameraControls",value:function(){this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement)}},{key:"addFloor",value:function(){var e=new THREE.PlaneGeometry(100,100),t=new THREE.ShadowMaterial({opacity:.3});this.floor=new THREE.Mesh(e,t),this.floor.name="floor",this.floor.position.y=-1,this.floor.rotateX(-Math.PI/2),this.floor.receiveShadow=!0,this.scene.add(this.floor)}},{key:"onResize",value:function(){this.width=window.innerWidth,this.height=window.innerHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height)}},{key:"addWaterDrop",value:function(){var e=new THREE.BoxBufferGeometry(.5,2,.5),t=new THREE.MeshStandardMaterial({color:"#24ddf7",metalness:.41,emissive:"#000000",roughness:0});return new THREE.Mesh(e,t)}},{key:"getRandomWaterDropPosition",value:function(){return this.waterDropPositions[Math.floor(Math.random()*Math.floor(this.waterDropPositions.length))]}},{key:"animateWaterDrops",value:function(){var e=this;this.interval=setInterval(function(){var t=e.addWaterDrop(),i=e.getRandomWaterDropPosition(),n=i.x,o=i.z;t.position.set(n,50,o),e.scene.add(t),e.pause?(e.scene.remove(t),TweenMax.killAll(!0)):TweenMax.to(t.position,1,{ease:Sine.easeIn,y:-2,onUpdate:function(){t.position.y<1&&t.position.y>-1&&(e.sound.play(),e.radius=1,e.motion=-1,e.ripple={x:n,z:o})},onComplete:function(){t.position.set(0,50,0),e.scene.remove(t)}})},1300)}},{key:"draw",value:function(){for(var e=0;e<this.grid.rows;e++)for(var t=0;t<this.grid.cols;t++){var i=(a=t,h=e,d=this.ripple.x-this.groupMesh.position.x,u=this.ripple.z-this.groupMesh.position.z,Math.sqrt(Math.pow(a-d,2)+Math.pow(h-u,2)));if(i<this.radius){var o=n(i,0,-this.waveLength,-100,100),s=this.angle+o,r=n(Math.sin(s),-1,0,this.motion>0?0:this.motion,0);this.meshes[e][t].position.y=r}}var a,h,d,u;this.angle-=2*this.velocity,this.radius-=3*this.velocity,this.motion-=this.velocity/5}},{key:"animate",value:function(){this.controls.update(),this.draw(),this.renderer.render(this.scene,this.camera),requestAnimationFrame(this.animate.bind(this))}},{key:"init",value:function(){this.setup(),this.addSoundControl(),this.createScene(),this.createCamera(),this.addAmbientLight(),this.addSpotLight(),this.createGrid(),this.addCameraControls(),this.addFloor(),this.animate(),this.draw(),this.animateWaterDrops()}}])&&o(t.prototype,i),s&&o(t,s),e}())).init()}]);