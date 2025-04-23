import type { GameStatus } from '@/types/types'
import { TIME_LIMIT } from '@/types/types'

/** ゲームの進行と画面表示を管理するcomposable */
export const useGame = () => {
	const gameFlg = useState<GameStatus>('gameFlg')// ゲームの進行状況
	const threeCount = useState<number>('countDown')// ゲームスタートまでのカウントダウン3秒
	const countNum = useState<number>('countNum')// 残り時間
	const myScore = useState<number>('myscore')// 獲得スコア

	/**  進行状況フラグを変更する
	 * @param situation ゲームの状況
	 */
	const setGameFlg = (situation: GameStatus) => {
		gameFlg.value = situation
	}
	/** タイマーを初期化する */
	const countReset = () => {
		countNum.value = TIME_LIMIT
		threeCount.value = 3
	}
	/** ゲームを初期化する */
	const reset = () => {
		countReset()
		myScore.value = 0
	}
	/**
	* 表示時間を１(秒)ずつ減らす
	* @param time 表示する時間
	*/
	const countTimer = (time: Ref<number>) => {
		time.value -= 1
	}
	const displayScore = useState<number>('displayScore')// アニメーション表示用スコア
	const { $anime } = useNuxtApp()// Anime.jsを取得
	/** 獲得スコアを0から変化させて表示するアニメーションを実行する */
	const animeScore = () => {
		const obj = { n: displayScore.value }
		$anime({
			targets: obj,
			n: myScore.value,
			round: 1,
			duration: 2000,
			easing: 'linear',
			update: () => {
				displayScore.value = obj.n
			},
		})
	}
	return {
		countNum,
		threeCount,
		gameFlg,
		myScore,
		setGameFlg,
		countReset,
		reset,
		countTimer,
		displayScore,
		animeScore,
	}
}
