import type { animationItems } from '@/types/types'
import { LEVEL } from '@/types/types'

/** アニメーションを起動するカスタムディレクティブ */
export default defineNuxtPlugin((nuxtApp) => {
	const { $anime } = useNuxtApp()// Anime.js
	/** アニメーションの対象になるclass名を格納した配列 */
	const anime: animationItems[] = ['turn', 'pin', 'role', 'step', 'scale_up']
	/** 各アニメーションを実行するメソッドをまとめたobject */
	const moveChar: {
		[k in animationItems]: () => void
	} = {
		// 要素がコマ送りで転がっていく
		step: () => {
			$anime({
				targets: '.step',
				translateY: -150,
				direction: 'alternate',
				easing: 'steps(5)',
			})
		},
		// 要素が回転しながら大きくなる
		scale_up: () => {
			$anime({
				targets: '.scale_up',
				translateY: [{
					value: -150,
					duration: 800,
				}, {
					value: 0,
					duration: 800,
				}],
				rotate: {
					value: 360,
					duration: 5800,
					easing: 'easeInOutSine',
				},
				scale: [{
					value: 4,
					duration: 1600,
					delay: 800,
					easing: 'easeInOutQuart',
				}, {
					value: 1,
					duration: 1600,
					delay: 800,
					easing: 'easeInOutQuart',
				}],
				direction: 'alternate',
				delay: 250,
			})
		},
		// 要素が回転する
		role: () => {
			$anime({
				targets: '.role',
				translateX: [
					{ value: -150, duration: 2000, delay: 0 },
					{ value: 0, duration: 2000, delay: 0 }],
				rotate: 720,
				duration: 5000,
			})
		},
		// 要素がピン留めされて揺れる
		pin: () => {
			$anime({
				targets: '.pin',
				translateX: {
					value: '*=2.5',
					duration: 5000,
				},
				width: {
					value: '-=20px',
					duration: 1800,
					easing: 'easeInOutSine',
				},
				rotate: {
					value: '+=2turn',
					duration: 1800,
					easing: 'easeInOutSine',
				},
				direction: 'alternate',
			})
		},
		// 要素が画面を一周する
		turn: () => {
			$anime({
				targets: '.turn',
				translateX: [
					{ value: 250, duration: 1000, delay: 500 },
					{ value: 0, duration: 1000, delay: 500 },
				],
				translateY: [
					{ value: -40, duration: 500 },
					{ value: 40, duration: 500, delay: 1000 },
					{ value: 0, duration: 500, delay: 1000 },
				],
				scaleX: [
					{ value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
					{ value: 1, duration: 900 },
					{ value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
					{ value: 1, duration: 900 },
				],
				scaleY: [
					{ value: [1.75, 1], duration: 500 },
					{ value: 2, duration: 50, delay: 1000, easing: 'easeOutExpo' },
					{ value: 1, duration: 450 },
					{ value: 1.75, duration: 50, delay: 1000, easing: 'easeOutExpo' },
					{ value: 1, duration: 450 },
				],
				easing: 'easeOutElastic(1, .8)',
			})
		},
	}
	/** 要素が生成される度にランダムに選んだclass名を付与してmoveChar関数を実行する */
	nuxtApp.vueApp.directive('moving', {
		beforeUpdate(el) {
			const randamIndex = Math.floor(Math.random() * LEVEL)
			if (randamIndex < anime.length - 1) {
				el.classList.remove(...anime)
				el.classList.add(anime[randamIndex])
				moveChar[anime[randamIndex]]()
			}
			else {
				return false
			}
			return
		},
	})
})
