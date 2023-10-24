import {
	Vector2
} from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const DotScreenShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'time': {value: 0},
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1.0 },
		'progress': {value: 0},
		'alpha': {value: 0.0625}

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

	uniform vec2 center;
	uniform float angle;
	uniform float scale;
	uniform float progress;
	uniform float time;





	uniform vec2 tSize;

	uniform sampler2D tDiffuse;
	uniform float alpha;
	varying vec2 vUv;

	float pattern() {

		float s = sin( angle ), c = cos( angle );

		vec2 tex = vUv * tSize - center;
		vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

		return ( sin( point.x ) * sin( point.y ) ) * 4.0;

	}
	vec2 curvature = vec2(3.,3.);

	vec2 curveRemapUV(vec2 uv){
		 
		 uv = uv * 2.0 - 1.0;
		 vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
		 uv = uv + uv * offset * offset;
		 uv = uv * 0.5 + 0.5;
		 return uv;
	}
	uniform sampler2D textureSampler;
	 vec2 screenResolution = vec2(320., 240.);
    vec2 scanLineOpacity = vec2(1.,1.) ;
	 float vignetteOpacity = float(1.);
	vec4 scanLineIntensity(float uv, float resolution, float opacity)
 {
     float intensity = sin(uv * resolution * 3.14 * 2.0);
     intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
     return vec4(vec3(pow(intensity, opacity)), 1.0);
 }
	void main() {

		 
		vec2 newUV = vUv;

 

		
		vec2 p = 2. * vUv - vec2(1.);

		p += 0.1 * cos(scale * 3. * p.yx + time + vec2(1.2, 3.4));
		p += 0.1 * cos(scale * 3.7 * p.yx + 1.4 * time + vec2(2.2, 3.4));
		p += 0.1 * cos(scale * 5. * p.yx + 2.6 * time + vec2(4.2, 1.4));
		p += 0.3 * cos(scale * 7. * p.yx + 3.6 * time + vec2(10.2, 3.4));



 

		newUV.x = mix(vUv.x, length(p), progress);
		newUV.y = mix(vUv.y, 0.5, progress);


		vec4 color = texture2D( tDiffuse, newUV ); 

		gl_FragColor = color; 
	 
		vec2 remappedUV = curveRemapUV(vec2(vUv.x, vUv.y));
		vec4 baseColor = texture2D(textureSampler, remappedUV);
		baseColor *= scanLineIntensity(remappedUV.y, screenResolution.y , scanLineOpacity.y) ;
		baseColor *= scanLineIntensity(remappedUV.y, screenResolution.y  , scanLineOpacity.y )  ;
		if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0){
			//  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1) ;
			gl_FragColor = baseColor;
		} else {
			 gl_FragColor = baseColor;
		}


	}
 	`

};

export { DotScreenShader };








// import {
// 	Vector2
// } from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

// const DotScreenShader = {

// 	uniforms: {

// 		'tDiffuse': { value: null },
// 		'tSize': { value: new Vector2( 256, 256 ) },
// 		'center': { value: new Vector2( 0.5, 0.5 ) },
// 		'angle': { value: 1.57 },
// 		'scale': { value: 1.0 },
// 		'progress': {value: 0},

// 	},

// 	vertexShader: /* glsl */`

// 		varying vec2 vUv;

// 		void main() {

// 			vUv = uv;
// 			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

// 		}`,

// 	fragmentShader: /* glsl */`

// 	uniform vec2 center;
// 	uniform float angle;
// 	uniform float scale;
// 	uniform float progress;
// 	uniform float time;





// 	uniform vec2 tSize;

// 	uniform sampler2D tDiffuse;

// 	varying vec2 vUv;

// 	float pattern() {

// 		float s = sin( angle ), c = cos( angle );

// 		vec2 tex = vUv * tSize - center;
// 		vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

// 		return ( sin( point.x ) * sin( point.y ) ) * 4.0;

// 	}
// 	vec2 curvature = vec2(3.,3.);

// 	vec2 curveRemapUV(vec2 uv){
		 
// 		 uv = uv * 2.0 - 1.0;
// 		 vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
// 		 uv = uv + uv * offset * offset;
// 		 uv = uv * 0.5 + 0.5;
// 		 return uv;
// 	}
// 	uniform sampler2D textureSampler;
// 	 vec2 screenResolution = vec2(320., 240.);
//     vec2 scanLineOpacity = vec2(1.,1.) ;
// 	 float vignetteOpacity = float(1.);
// 	vec4 scanLineIntensity(float uv, float resolution, float opacity)
//  {
//      float intensity = sin(uv * resolution * 3.14 * 2.0);
//      intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
//      return vec4(vec3(pow(intensity, opacity)), 1.0);
//  }
// 	void main() {

		 
// 		vec2 newUV = vUv;

 

		
// 		vec2 p = 2. * vUv - vec2(1.);

// 		p += 0.1 * cos(scale * 3. * p.yx + time + vec2(1.2, 3.4));
// 		p += 0.1 * cos(scale * 3.7 * p.yx + 1.4 * time + vec2(2.2, 3.4));
// 		p += 0.1 * cos(scale * 5. * p.yx + 2.6 * time + vec2(4.2, 1.4));
// 		p += 0.3 * cos(scale * 7. * p.yx + 3.6 * time + vec2(10.2, 3.4));



 

// 		newUV.x = mix(vUv.x, length(p), progress);
// 		newUV.y = mix(vUv.y, 0.5, progress);


// 		vec4 color = texture2D( tDiffuse, newUV ); 

// 		gl_FragColor = color; 
	 
// 		vec2 remappedUV = curveRemapUV(vec2(vUv.x, vUv.y));
// 		vec4 baseColor = texture2D(textureSampler, remappedUV);
// 		baseColor *= scanLineIntensity(remappedUV.x, screenResolution.y, scanLineOpacity.x);
// 		baseColor *= scanLineIntensity(remappedUV.y, screenResolution.x, scanLineOpacity.y);
// 		if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0){
// 			 gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
// 		} else {
// 			 gl_FragColor = baseColor;
// 		}


// 	}
//  	`

// };

// export { DotScreenShader };