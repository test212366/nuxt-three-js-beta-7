import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' 
import GUI from 'lil-gui'
import gsap from 'gsap'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

import fragmentShaderGlass from './shaders/fragmentGlass.glsl'
import vertexShaderGlass from './shaders/vertexGlass.glsl'


import fragmentShaderSlider1 from './shaders/fragmentObjectSlider1.glsl'
import vertexShaderSlider1 from './shaders/vertexObjectSlider1.glsl'
import fragmentShaderSlider2 from './shaders/fragmentObjectSlider2.glsl'



import fragmentPlanes from './shaders/fragmentPlanes.glsl'
import vertexShaderPlanes from './shaders/vertexPlanes.glsl'

import fragmentBitcoin from './shaders/fragmentBitcoin.glsl'
import vertexShaderParticles from './shaders/vertexParticles.glsl'

import { MSDFTextGeometry, MSDFTextMaterial, uniforms } from "three-msdf-text-utils";

import fragmentBitcoinPoints from './shaders/fragmentBGPoints.glsl'
import vertexShaderParticlesPoints from './shaders/vertexParticlesBGPoints.glsl'
 
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass'

import particle from './purp.png'

import model from './bitcoin_free_model_2.glb'
import {DotScreenShader} from './customShader'
import fnt from './font/FontsFree-Net-SF-Pro-Rounded-Regular-msdf.json'
import atlasURL from './font/FontsFree-Net-SF-Pro-Rounded-Regular.png'

const WIDTH = 128,
TEXT = [
	'Develop a collection',
	'Smart contract',
	'To build a collection',
	'Develop a TON bot',
	'Smartworking presentation',
	'Audience engagement',
	'To build 3d a collection',
	// 'Marketing',

]

function lerp(a,b,t) {
	return a * (1-t)+ b * t
}

export default class Sketch {
	constructor(options) {
		
		this.scene = new THREE.Scene()
		this.sceneCopy = new THREE.Scene()

		this.groupPointsBitcoin = new THREE.Group()
		this.groupText = new THREE.Group()
		this.groupTextCopy = new THREE.Group()
		this.groupPlane = new THREE.Group()

		// this.groupText.position.y = 3
		// this.groupTextCopy.position.y = -20
		this.groupPlane.position.z = 3
 

		
		this.sceneCopy.add(this.groupTextCopy)
		this.scene.add(this.groupText)
		this.scene.add(this.groupPlane)


		this.container = options.dom
		
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight
		
		
		// // for renderer { antialias: true }
		this.renderer = new THREE.WebGLRenderer({ antialias: true})
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height)
		this.renderer.setSize(this.width ,this.height )
		this.renderer.setClearColor(0xeeeeee, 1)
		this.renderer.useLegacyLights = true
		this.renderer.outputEncoding = THREE.sRGBEncoding


 
		this.raycaster = new THREE.Raycaster()
		this.pointer = new THREE.Vector2()
		this.point = new THREE.Vector3()

		 
		this.renderer.setSize( window.innerWidth, window.innerHeight )




 

 
		



		this.container.appendChild(this.renderer.domElement)
 


		this.camera = new THREE.PerspectiveCamera( 70,
			 this.width / this.height,
			 0.01,
			 1000
		)
 
		this.camera.position.set(0, 0, 5) 
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.time = 0


		this.aspect = this.width / this.height
		this.dracoLoader = new DRACOLoader()
		this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
		this.gltf = new GLTFLoader()
		this.gltf.setDRACOLoader(this.dracoLoader)

		this.isPlaying = true
		this.initPost()
		this.gltf.load(model, (gltf) => {
			this.model = gltf.scene.children[0].children[0].children[0]
			//geometry for Points for model 
		 
			this.geometryModel = this.model.geometry
			this.geometryModel.center()
	 
 
		 
			this.addSettingsForModel()
			this.addObjects()		 
			this.addPointsBG()
			this.resize()
			this.render()
			this.setupResize()
			this.addText()
			this.raycasterEvent()
			// this.addObjectsSlider()
			// this.addImages()
 
	 
		})
	 

 
	}
	addGlasses() {
		this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
			format: THREE.RGBAFormat,
			minFilter: THREE.LinearMipMapLinearFilter,
			generateMipmaps: true,
			encoding: THREE.sRGBEncoding
		})
		this.cubeCamera = new THREE.CubeCamera(0.1, 10,this.cubeRenderTarget)

		
		let geo = new THREE.SphereGeometry(1.4, 32, 32)
		this.mat = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				tCube: {value: 0},
				resolution: {value: new THREE.Vector4()}
			},
			vertexShader: vertexShaderGlass,
			fragmentShader: fragmentShaderGlass,
		 
		})
		this.smallSphere = new THREE.Mesh(geo, this.mat)
		this.scene.add(this.smallSphere)
	}
	addObjectsSlider() {
		this.geometry = new THREE.PlaneGeometry(1,1).rotateX(Math.PI /2)

		this.material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				resolution: {value: new THREE.Vector4()},
				level: {value: 0},
				black: {value: 0}


			},
			transparent: true,
			vertexShader: vertexShaderSlider1,
			fragmentShader: fragmentShaderSlider1
		})
		this.bratt = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				resolution: {value: new THREE.Vector4()},
				level: {value: 0},
				black: {value: 0}


			},
			transparent: true,
			vertexShader: vertexShaderSlider1,
			fragmentShader: fragmentShaderSlider2
		})
		this.gr = new THREE.Group()

		this.gr.position.y = -0.5

		this.scene.add(this.gr)

		this.matts = []

		for (let i = 0; i <= this.number; i++) {
			let level = i / this.number
			let m0 = this.material.clone()
			let m1 = this.material.clone()

			this.matts.push(m0)
			this.matts.push(m1)

			m0.uniforms.black.value = 1
			m1.uniforms.black.value = 0
			m0.uniforms.level.value = level
			m1.uniforms.level.value = level
 

			let mesh = new THREE.Mesh(this.geometry, m0)
			let mesh1 = new THREE.Mesh(this.geometry, m1)
			mesh1.position.y = level - 0.005

			mesh.position.y = level

			if(i == this.number) {
				mesh1.position.y = level - 1 / this.number
			}

			this.gr.add(mesh)
			this.gr.add(mesh1)

		}
		let mesh2 = new THREE.Mesh(new THREE.PlaneGeometry(6,6), this.bratt).rotateX(Math.PI / 2)
		mesh2.position.y = 0.4
		
		this.gr.add(mesh2)
	}

	raycasterEvent() {

		let mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(8 * this.aspect,8).rotateX(-this.planeBGPoints.rotation.x - .6).rotateY(this.planeBGPoints.rotation.y).rotateZ(this.planeBGPoints.rotation.z),
			 new THREE.MeshBasicMaterial({color: 0xff0000}) )
 
			 let test = new THREE.Mesh(
				new THREE.SphereGeometry(0.1, 10, 10),
				 new THREE.MeshBasicMaterial({color: 0xff0000}) )

 
 
		window.addEventListener('pointermove', event => {
			this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
			this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1

			this.raycaster.setFromCamera(this.pointer, this.camera)

			const intersects = this.raycaster.intersectObjects([
				mesh
			])
		 
			if(intersects[0]) {
	 
				test.position.copy(intersects[0].point)
				this.point.copy(intersects[0].point)
	 
			}


		})

		 

	}
	addText() {
		this.materialText = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			transparent: true,
			defines: {
				 IS_SMALL: false,
			},
			extensions: {
				 derivatives: true,
			},
			uniforms: {
				uSpeed: {value: 0},
				uOpac: {value: 0},

				 // Common
				 ...uniforms.common,
				 
				 // Rendering
				 ...uniforms.rendering,
				 
				 // Strokes
				 ...uniforms.strokes,
			 
			},
			vertexShader: `
				 // Attribute
				 attribute vec2 layoutUv;
	  
				 attribute float lineIndex;
	  
				 attribute float lineLettersTotal;
				 attribute float lineLetterIndex;
	  
				 attribute float lineWordsTotal;
				 attribute float lineWordIndex;
	  
				 attribute float wordIndex;
	  
				 attribute float letterIndex;
	  
				 // Varyings
				 varying vec2 vUv;
				 varying vec2 vLayoutUv;
				 varying vec3 vViewPosition;
				 varying vec3 vNormal;
	  
				 varying float vLineIndex;
	  
				 varying float vLineLettersTotal;
				 varying float vLineLetterIndex;
	  
				 varying float vLineWordsTotal;
				 varying float vLineWordIndex;
	  
				 varying float vWordIndex;
	  
				 varying float vLetterIndex;


				 mat4 rotationMatrix(vec3 axis, float angle) {
					axis = normalize(axis);
					float s = sin(angle);
					float c = cos(angle);
					float oc = 1.0 - c;
					
					return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
									oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
									oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
									0.0,                                0.0,                                0.0,                                1.0);
			  }
			  
			  vec3 rotate(vec3 v, vec3 axis, float angle) {
				  mat4 m = rotationMatrix(axis, angle);
				  return (m * vec4(v, 1.0)).xyz;
			  }

			  uniform float uSpeed;


	  
				 void main() {
			 
	  
					  // Varyings
					  vUv = uv;
					  vLayoutUv = layoutUv;
					  
					  vNormal = normal;
	  
					  vLineIndex = lineIndex;
	  
					  vLineLettersTotal = lineLettersTotal;
					  vLineLetterIndex = lineLetterIndex;
	  
					  vLineWordsTotal = lineWordsTotal;
					  vLineWordIndex = lineWordIndex;
	  
					  vWordIndex = wordIndex;
	  
					  vLetterIndex = letterIndex;

					  // Output

					  vec3 newpos = position;
					  float xx = position.x * 0.005;
					  newpos = rotate(newpos, vec3(.0, 0.0, 1.0), uSpeed * xx * xx * xx);
					  vec4 mvPosition = vec4(newpos, 1.0);
					  mvPosition = modelViewMatrix * mvPosition;
					  gl_Position = projectionMatrix * mvPosition;
					  vViewPosition = -mvPosition.xyz;
				 }
			`,
			fragmentShader: `
				 // Varyings
				 varying vec2 vUv;
	  
				 // Uniforms: Common
				 uniform float uOpacity;
				 uniform float uOpac;

				 uniform float uThreshold;
				 uniform float uAlphaTest;
				 uniform vec3 uColor;
				 uniform sampler2D uMap;
	  
				 // Uniforms: Strokes
				 uniform vec3 uStrokeColor;
				 uniform float uStrokeOutsetWidth;
				 uniform float uStrokeInsetWidth;
	  
				 // Utils: Median
				 float median(float r, float g, float b) {
					  return max(min(r, g), min(max(r, g), b));
				 }
	  
				 void main() {
					  // Common
					  // Texture sample
					  vec3 s = texture2D(uMap, vUv).rgb;
	  
					  // Signed distance
					  float sigDist = median(s.r, s.g, s.b) - 0.5;
	  
					  float afwidth = 1.4142135623730951 / 2.0;
	  
					  #ifdef IS_SMALL
							float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
					  #else
							float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
					  #endif
	  
					  // Strokes
					  // Outset
					  float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;
	  
					  // Inset
					  float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;
	  
					  #ifdef IS_SMALL
							float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
							float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
					  #else
							float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
							float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
					  #endif
	  
					  // Border
					  float border = outset * inset;
	  
					  // Alpha Test
					  if (alpha < uAlphaTest) discard;
	  
					  // Some animation
					//   alpha *= sin(uTime);
	  
					  // Output: Common
	  
					  vec4 filledFragColor = vec4(.95, .95, .95, uOpac * alpha);
	  
					  gl_FragColor = filledFragColor;
					//   gl_FragColor = vec4(1., 1., 1., 1.);
				 }
			`,
	  });


	  Promise.all([
		loadFontAtlas(atlasURL)
 	 ]).then(([atlas]) => {

		this.size = 0.7



		this.materialText.uniforms.uMap.value = atlas;
		TEXT.forEach((text, i) => {
			const geometry = new MSDFTextGeometry({
				text: text.toUpperCase(),
				font: fnt,
		  });
	 
			
		 
	 
		  const mesh = new THREE.Mesh(geometry, this.materialText);
		  let s = 0.009
		  mesh.position.x = -2.3
		  if(window.innerWidth < 1000) {
			s = 0.005
			this.size = 0.5
			mesh.position.x = -1.3
			}
			if(window.innerWidth < 530) {
				s = 0.004
			this.size = 0.4

			}
			if(window.innerWidth < 400) {
				s = 0.003
			this.size = 0.35
			mesh.position.x = -1
			}
		  mesh.scale.set(s,-s,s)
	 
		  mesh.position.y = this.size * i
 

 
		  this.groupText.add(mesh)
		  this.groupTextCopy.add(mesh.clone())

		})

		 
	})

	function loadFontAtlas(path) {
		const promise = new Promise((resolve, reject) => {
			 const loader = new THREE.TextureLoader();
			 loader.load(path, resolve);
		});
  
		return promise;
  }


	}
	addImages() {
		this.planeMaterial = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				uTexture: {value: new THREE.Loader().load(particle)},
				resolution: {value: new THREE.Vector4()}
			},
			vertexShader: vertexShaderPlanes,
			fragmentShader: fragmentPlanes,
 
		})
		
		this.geometryPlane = new THREE.PlaneGeometry(1.77 /3 ,1 /3 ,30,30).translate(0,0,1)
		let pos = this.geometryPlane.attributes.position.array
		let newpos = []
		let r = 1.2
		for (let i = 0; i < pos.length; i+= 3) {
			let x = pos[i]
			let y = pos[i + 1]
			let z = pos[i + 2]
			
			let xz = new THREE.Vector2(x, z).normalize().multiplyScalar(r)

			newpos.push(xz.x, y, xz.y)
		}
		
		this.geometryPlane.setAttribute('position', new THREE.Float32BufferAttribute(newpos, 3))
		this.planeImage = new THREE.Mesh(this.geometryPlane, this.planeMaterial)
 
		this.groupPlane.add(this.planeImage)
	}

	initPost() {
		this.composer = new EffectComposer(this.renderer)
		this.composer.addPass(new RenderPass(this.scene, this.camera))
	 
		

		this.effect1 = new ShaderPass(DotScreenShader)
		 
		this.composer.addPass(this.effect1)
	}

	addSettingsForModel() {
		this.materialModel = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				resolution: {value: new THREE.Vector4()},
				uTexture: {value: new THREE.TextureLoader().load(particle)},
				uColor1: {value: new THREE.Color(0xe87fd8)},
				uColor2: {value: new THREE.Color(0xB679D3)},
				uColor3: {value: new THREE.Color(0x513ADB)},
				uMouse: {value: new THREE.Vector3()},
				distortion: {value: 0},
			},
			vertexShader: vertexShaderParticles,
			fragmentShader: fragmentBitcoin,
			transparent: true,
			vertexColors: true,
			depthTest: false,
		})
		this.number = 180000
		this.geomModel = new THREE.BufferGeometry()
		this.reference = new Float32Array(WIDTH * WIDTH * 2)

		let colorRandoms = new Float32Array(WIDTH * WIDTH )
		
		for (let i = 0; i < WIDTH * WIDTH; i++) {
	 

			let xx = (i % WIDTH) / WIDTH
			let yy = ~~(i / WIDTH) / WIDTH
			colorRandoms.set([Math.random()], i)
			
			this.reference.set([xx,yy], i * 2)

		}
		// console.log(colorRandoms);
 
		this.geomModel.setAttribute('reference', new THREE.BufferAttribute(this.reference,2 ))
	 
 
		this.geomModel = this.geometryModel
		this.geomModel.setAttribute('colorRandoms', new THREE.BufferAttribute(colorRandoms, 1))
 

		this.bitPoints = new THREE.Points(this.geomModel, this.materialModel)

		//current rotation model for bitcoin
		this.bitPoints.scale.set(0.044, 0.044, 0.044)
		this.bitPoints.rotateX(-2.1)
		this.bitPoints.rotateZ(0.4)
 
		this.bitPoints.translateY(-0.1)
		this.groupPointsBitcoin.add(this.bitPoints)
		//add bitcoin
		this.scene.add(this.groupPointsBitcoin)

	}
 
	addPointsBG() {
		this.geometryPointsBG = new THREE.BufferGeometry()
	
		this.materialBGPoints = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				resolution: {value: new THREE.Vector4()},
				amp: {value: 3},
				size: {value: .5},
				uMouse: {value: new THREE.Vector3()},
				uColor1: {value: new THREE.Color(0xe87fd8)},
				uColor2: {value: new THREE.Color(0x834CDC)},
				uColor3: {value: new THREE.Color(0x9F37CD)},
				// uTexture: {value: new THREE.TextureLoader().load(particle)},
			},
			vertexShader: vertexShaderParticlesPoints,
			fragmentShader: fragmentBitcoinPoints,
			transparent: true,
			vertexColors: true,
			wireframe: true,
			depthTest: false,
		})


		const count = 1000
		let positioin = new Float32Array(count * count * 3)

		let colorRandoms = new Float32Array(128 * 128 )

	

		for (let i = 0; i <= count ; i++) {
		 
			let angle = Math.random() * 2 * Math.PI
			let r = lerp(2., 4.2, Math.random())

			// let x = r* Math.cos(angle)
			// let y = r* Math.sin(angle)
			// let z =  (Math.random() - 0.5) * 0.1 // Math.sin(angle * 1.1)  // 
 
			let x = r* Math.sin(angle)
			let y = (Math.random() - 0.5) * 0.1
			let z = r* Math.cos(angle)

			colorRandoms.set([Math.random()], i)
			 
			positioin.set([x,y,z], i * 3);
 


			 
			
		}

		this.geometryPointsBG.setAttribute('position', new THREE.BufferAttribute(positioin, 3))
		this.geometryPointsBG.setAttribute('colorRandoms', new THREE.BufferAttribute(colorRandoms, 1))
 
		this.planeBGPoints = new THREE.Points(this.geometryPointsBG, this.materialBGPoints)
		
	 
		this.planeBGPoints.rotateX(.5)
		// this.planeBGPoints.rotateY(-3.2)
		// this.planeBGPoints.translateZ(0.)
		// this.planeBGPoints.geometry.center()
		this.planeBGPoints.translateZ(-0.4)
		// this.planeBGPoints.translateY(0.1)
 
		this.planeBGPoints.translateY(-.5)
		this.scene.add(this.planeBGPoints)
		// this.scene.add(this.planeBGPoints)

	}
 
 
	settings() {
		let that = this
		this.settings = {
			distortion: 0
		}
		this.gui = new GUI()
		this.gui.add(this.settings, 'distortion', 0, 3, 0.01)

	}

	setupResize() {
		window.addEventListener('resize', this.resize.bind(this), false)
	}

	resize() {
		this.width = this.container.offsetWidth
		this.height = this.container.offsetHeight
		this.renderer.setSize(this.width, this.height)
		this.camera.aspect = this.width / this.height
 
		this.imageAspect = 853/1280
		let a1, a2
		if(this.height / this.width > this.imageAspect) {
			a1 = (this.width / this.height) * this.imageAspect
			a2 = 1
		} else {
			a1 = 1
			a2 = (this.height / this.width) / this.imageAspect
		} 
		// this.plane.scale.x = this.width
		// this.plane.scale.y = this.height

		//как сделать чтобы planeGeometry всегда была на весь экран при resize 

		this.material.uniforms.resolution.value.x = this.width
		this.material.uniforms.resolution.value.y = this.height
		this.material.uniforms.resolution.value.z = a1
		this.material.uniforms.resolution.value.w = a2

		this.camera.updateProjectionMatrix()



	}


	addObjects() {
		let that = this
		this.material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: {value: 0},
				resolution: {value: new THREE.Vector4()}
			},
			vertexShader,
			fragmentShader
		})
		
		//как растянуть planeGeometry на весь экран в three js
		this.geometry = new THREE.PlaneGeometry(8 * this.aspect,8)
		this.plane = new THREE.Mesh(this.geometry, this.material)
 
		this.scene.add(this.plane)
 
	}
 

	addLights() {
		const light1 = new THREE.AmbientLight(0xeeeeee, 0.5)
		this.scene.add(light1)
	
	
		const light2 = new THREE.DirectionalLight(0xeeeeee, 0.5)
		light2.position.set(0.5,0,0.866)
		this.scene.add(light2)
	}

	stop() {
		this.isPlaying = false
	}

	play() {
		if(!this.isPlaying) {
			this.isPlaying = true
			this.render()
		}
	}

	render() {
		if(!this.isPlaying) return
		this.time += 0.05
		this.material.uniforms.time.value = this.time
		this.materialModel.uniforms.time.value = this.time
		this.materialBGPoints.uniforms.time.value = this.time
		this.materialBGPoints.uniforms.uMouse.value = this.point
		this.materialModel.uniforms.uMouse.value = this.point

		// this.materialModel.uniforms.distortion.value = this.settings.distortion
		// this.smallSphere.visible = false
		// this.cubeCamera.update(this.renderer, this.scene)
		// this.smallSphere.visible = true
		
		
		// this.mat.uniforms.tCube.value = this.cubeRenderTarget.texture

		this.bitPoints.rotateY(-.003)
 
		if(this.bitPoints.rotation.z < -1.2 ) {
		 
		} else {
			this.bitPoints.rotation.z += this.point.x / 1000
		
		}
	 
		this.planeBGPoints.rotation.z += this.point.x / 10000
	 
	 
		this.composer.render()
 
	 
		 
		requestAnimationFrame(this.render.bind(this))
	}
 
}
 