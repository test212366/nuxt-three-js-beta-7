import Sketch from "./module";
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger, SplitText } from "gsap/all";

import Swiper from 'swiper';

  // import styles bundle
  import 'swiper/swiper.css';




  const swiper = new Swiper('.swiper', {
	// Optional parameters
	// direction: 'vertical',
	// loop: true,
	speed: 1200,
	slidesPerView: 1.3,
	spaceBetween: 30,
	centeredSlides: true,
	initialSlide: 1,
	breakpoints: {
		350: {
			slidesPerView: 1.5,

		},
		600: {
			slidesPerView: 1.8,

		},
		850: {
			slidesPerView: 2.2,

		},
		1250: {
			slidesPerView: 3,
		 
		},
	}
 });
 
;(() => {


	const cursorDot = document.querySelector('.cursor-dot')
	const cursorOutline = document.querySelector('.cursor-outline')


	window.addEventListener('mousemove', e => {
		const posX = e.clientX
		const posY = e.clientY

		cursorDot.style.left = `${posX}px`
		cursorDot.style.top = `${posY}px`


		cursorOutline.animate({
			left: `${posX}px`,
			top: `${posY}px`
		}, {duration: 700, fill: 'forwards'})

	})



	function onEntry(entry) {
		entry.forEach(change => {
 
		  if (change.isIntersecting) {
			change.target.classList.add('element-show');
		  } else {
			change.target.classList.remove('element-show');

		  }
		});
	 }
	 
	let options = {
		threshold: [0.3] };
	 let observer = new IntersectionObserver(onEntry, options);
	const scroll = document.getElementById('scrollTarget')
	const elements = document.querySelectorAll('#anim')
	const nextSlide = document.getElementById('nextSlide')
	const prevSlide = document.getElementById('prevSlide')
	const sliderName = document.getElementById('sliderName')

	const timeline1 = gsap.timeline()
	const timeline2 = gsap.timeline()
	const timeline3 = gsap.timeline()
	const timeline4 = gsap.timeline()
	const timeline5 = gsap.timeline()
	const timeline6 = gsap.timeline()


	let animComplete = false

	for (let elm of elements) {
		observer.observe(elm);
	 }

	gsap.registerPlugin(ScrollTrigger)


	const sketch = new Sketch({
		dom: document.getElementById('container')
	})
	
	
	// return
 
	let o = {a: 0}
	timeline1.to(o, {
		a: 1,
		scrollTrigger: {
			trigger: '.wrap',
			start: 'top top',
			end: 'bottom bottom',
			snap: 1/(5 - 1),
			onUpdate: (self) => {
				// console.log(self.scroller.pageYOffset);

				if(self.scroller.pageYOffset > 3000) {
					sketch.planeBGPoints.rotation.y -= self.progress / 23
					sketch.planeBGPoints.rotation.x -= self.progress / 32
					sketch.planeBGPoints.position.x -= self.progress / 32


					 
					timeline6.to(sketch.materialModel.uniforms.distortion, {
						duration: 1,
						value: 0,
						ease: 'power2.inOut',
						overwrite: "none",
						onComplete: () => {
							timeline6.kill()
						}
					})
					// timeline4.to(sketch.materialModel.uniforms.distortion, {
					// 	duration: 1,
					// 	value: 0,
					// 	ease: 'power2.inOut',
					// 	overwrite: "none",
					// 	onComplete: () => {
					// 		timeline4.kill();
					//   }
					// })
				}



				if(self.scroller.pageYOffset > 50 && scroll.style.opacity !== 0 && self.scroller.pageYOffset < 1000) {
					//hide scroll 
					scroll.style.opacity = 0
					sketch.groupPointsBitcoin.rotation.x = self.progress * 11
					sketch.planeBGPoints.rotation.x += self.progress / 11
			 
					if(sketch.planeBGPoints.position.x > 3.3) {
						sketch.planeBGPoints.position.x -= self.progress / 5
						sketch.planeBGPoints.rotation.x += self.progress / 7

					} else {
						sketch.planeBGPoints.position.x += self.progress / 5

					}

				 	timeline4.to(sketch.materialModel.uniforms.distortion, {
						duration: 1.5,
						value: 3,
						ease: 'power2.inOut',
						overwrite: "none"
					})
					timeline4.to(sketch.materialModel.uniforms.distortion, {
						duration: 1,
						value: 0,
						ease: 'power2.inOut',
						overwrite: "none",
						onComplete: () => {
							timeline4.kill();
					  }
					})
					 
				} else if(self.scroller.pageYOffset < 50 && scroll.style.opacity == 0) {
					//show scroll 
					scroll.style.opacity = 1
					 
			 
				}
			 

	


				if(self.progress < 0.35 && animComplete) {
					sketch.groupText.translateY(.5)
					 
				}
				
				//init scroll down
				if(self.progress > 0.35 && self.progress < 0.55) {
					timeline5.to(sketch.materialModel.uniforms.distortion, {
						duration: 1.5,
						value: 1.3,
						ease: 'power2.inOut',
						overwrite: "none",
						onComplete: () => {
									timeline5.kill();
							  }
					})
					sketch.planeBGPoints.rotation.z += self.progress / 20
					sketch.planeBGPoints.rotation.y += self.progress / 17


					// timeline5.to(sketch.materialModel.uniforms.distortion, {
					// 	duration: 1,
					// 	value: 0,
					// 	ease: 'power2.inOut',
					// 	overwrite: "none",
					// 	onComplete: () => {
					// 		timeline5.kill();
					//   }
					// })

					// if (!timeline2.isActive()) timeline2.restart();
					if(!timeline2.isActive() && !animComplete) {
						timeline3.to(sketch.materialText.uniforms.uSpeed, {
							duration: 1,
							value: .01,
							ease: 'power2.inOut',
					 
						})
					 
						timeline3.to(sketch.materialText.uniforms.uSpeed, {
							duration: 1,
							value: 0,
							ease: 'power2.inOut',
							overwrite: "none",
							onComplete: () => {
								timeline3.kill();
						  }
						})
						timeline2.to(sketch.materialText.uniforms.uOpac, {
							duration: 1,
							value: 1,
							ease: 'power2.inOut',
		
							onComplete: () => {
								timeline2.pause();
								animComplete = true
							}
						})
						 
					}
					sketch.groupText.position.y = 1 - (self.progress * sketch.size)  * 10
					// sketch.groupTextCopy.position.y = 1 - (self.progress * sketch.size)  * 10
				}

				if(self.progress >= .55) {
					sketch.groupText.translateY(-.5)
				 
				}  
				
				
				//else  {
				// 	sketch.groupText.position.y -= (self.progress * sketch.size) / 3.9
				// 	sketch.groupTextCopy.position.y -= (self.progress * sketch.size) / 3.9
				// }
				
				
				
				// if(sketch.planeBGPoints.position.x > 0.39 && self.scroller.scrollY < 1100) {
				// 	sketch.planeBGPoints.translateX(-self.progress * 20 ) 	
				// } else if(self.scroller.scrollY < 1100) {
				// 	sketch.planeBGPoints.translateX(self.progress * 20) 	


				// }

				// if(self.scroller.scrollY < 1100) {
				// 	sketch.planeBGPoints.rotateX(self.progress / 5.1) 
				// 	sketch.groupPointsBitcoin.rotateX(self.progress / 2.4)
				// }
			 



				
				// if(self.scroller.scrollY >= 500 && self.scroller.scrollY <= 550 ) {
				// 	scroll.style.opacity = 0
				 
				// 	//rotate bitcoin into scene
					 
				

				// 	//rotate ring points
				// 	// sketch.planeBGPoints.rotateX(0.011)
				// 	// sketch.planeBGPoints.translateX(-0.07) 	
				// 	// titleOne.style.opacity = 0
				// 	timeline5.to(sketch.groupPointsBitcoin.position.x, {
				// 		duration: 1,
				// 		value: 20,
					 
				// 	})

				// 	timeline2.to(sketch.materialModel.uniforms.distortion, {
				// 		duration: 1,
				// 		value: 3,
				// 		ease: 'power2.inOut',
				// 		overwrite: "none"
				// 	})
				// 	timeline2.to(sketch.materialModel.uniforms.distortion, {
				// 		duration: 1,
				// 		value: 0,
				// 		ease: 'power2.inOut',
				// 		overwrite: "none",
				// 		onComplete: () => {
				// 			timeline2.kill();
				// 	  }
				// 	})
					 
				// }
				// if(self.progress > 0.2) {
				// 	titleTwo.style.opacity = 0
				// }
				// if(self.progress > 0.3) {
				// 	titleThree.style.opacity = 0
				// }

				// if(self.progress > 0.6) {
				// 	sketch.groupText.position.y += (self.progress * sketch.size) / 3.9
				// 	sketch.groupTextCopy.position.y += (self.progress * sketch.size) / 3.9
				// 	// sketch.materialText.uniforms.uSpeed.value = .01
				// 	sketch.planeBGPoints.rotateX(-0.02)

				// 	sketch.planeBGPoints.translateX(+0.5) 
		 
				// 	//TODO we will need to add aditional if if self.progress < 0.9 like this
				// 	//its depends on next slides i mean if you go down transforms still works and this changed position 

				// 	timeline4.to(sketch.materialModel.uniforms.distortion, {
				// 		duration: 1,
				// 		value: 1,
				// 		ease: 'power2.inOut',
				// 		overwrite: "none"
				// 	})
				// 	timeline3.to(sketch.materialText.uniforms.uSpeed, {
				// 		duration: 1,
				// 		value: -.02,
				// 		ease: 'power2.inOut',
				 
				// 	})
				 
				// 	timeline3.to(sketch.materialText.uniforms.uSpeed, {
				// 		duration: 1,
				// 		value: 0,
				// 		ease: 'power2.inOut',
				// 		overwrite: "none",
				// 		onComplete: () => {
				// 			timeline3.kill();
				// 	  }
				// 	})
			 
				// }
				// if(self.progress > 0.9) {
				// 	sketch.planeBGPoints.translateX(-0.8) 
				// 	sketch.planeBGPoints.rotateX(+0.0001)

				// }
				// else {
				// 	// scroll.style.opacity = 1
				// 	// titleOne.style.opacity = 1
				// 	// titleTwo.style.opacity = 1
				// 	// titleThree.style.opacity = 1

				// 	// sketch.groupPointsBitcoin.translateX(+0.02)
		 
 
				// }
			 
		 
			},
	 
		}
	
	})

	nextSlide.addEventListener('click', () => {
		swiper.slideNext()
		sliderName.className = ''
		setTimeout(() => {
			sliderName.textContent = document.querySelector('.section__slider-desc .swiper-slide-active h6').textContent 
			sliderName.className = 'active'
		}, 400)
		
	})
	prevSlide.addEventListener('click', () => {
		swiper.slidePrev()
		sliderName.className = ''
		setTimeout(() => {
			sliderName.textContent = document.querySelector('.section__slider-desc .swiper-slide-active h6').textContent 
			sliderName.className = 'active'
		}, 400)
 

	})

	gsap.timeline().add([timeline1, timeline2, timeline3, timeline4,timeline5, timeline6])
 
})()


 