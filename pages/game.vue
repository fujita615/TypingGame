<!-- ゲーム画面 -->
<script setup lang="ts">
import { TIME_LIMIT } from '@/types/types'

definePageMeta({
	middleware: ['game-access'],
	layout: 'game',
})
const { category } = useCategory()
const { anserWord, currentWords, contentLengthCheck, getNextQuiz, clearCharacter, clearCount, missCount, questions, gameRefresh } = useQuiz()
const { gameFlg, countNum, threeCount, myScore, setGameFlg, reset, countTimer, displayScore, animeScore, countReset } = useGame()
const { registeredData, updateScore, showScoreFlg } = useUser()

/**
 *スコア関連の値を初期化して３カウントダウンを開始するイベントハンドラ
 * @remarks 出題単語リストが空だった場合はエラーページへ遷移
 */
const gameStart = () => {
	if (questions.value === null || questions.value.length === 0) {
		throw createError({ statusCode: 500, fatal: true })
	}
	displayScore.value = 0
	myScore.value = 0
	anserWord.value = ''
	setGameFlg('count')
	threeCountDown()
	missCount.value = 0
	clearCount.value = 0
	clearCharacter.value = 0
	showScoreFlg.value = false
}

/** 得点を集計してDB登録メソッドを呼び出す */
const score = () => {
	let score = 0
	if (gameFlg.value === 'finished') {
		score = (clearCharacter.value * 2) - (missCount.value * 2) + clearCount.value
		if (bonusTime.value >= 0) {
			score += bonusTime.value
		}
	}
	if (score < 0) score = 0
	myScore.value = score
	// ベストスコアを上回ったら登録ベストスコアを更新する
	if (registeredData.value.nickname !== '' && myScore.value >= registeredData.value.score) {
		updateScore()
	}
	showScoreFlg.value = true
}
// 全問クリア時の残り時間
const bonusTime = ref<number>(0)

/**
 * game開始前の3秒を数えて０に制限時間カウントメソッドを呼び出す
 * @remarks
 * ページを離脱した時やブラウザがsleepされた時はカウントダウンを中止する
 */
const threeCountDown = () => {
	const { soundPlay,	countSound, startSound } = soundsUtil()
	soundPlay(countSound)// カウント音を鳴らす
	const startDate = Date.now()// ゲームスタートした時刻を記録
	const timer = window.setInterval(() => {
		countTimer(threeCount)
		// ゲームスタート時刻とカウントダウン数から予測する現在時刻
		const predictionNow = startDate + (3 - threeCount.value) * 1000
		// Gameの進行状況がcount以外の時(=ページ離脱時)
		if (gameFlg.value !== 'count') {
			window.clearInterval(timer)
		}
		// 予測した現在時刻と実際の時刻が違った時(ブラウザがsleepされていた時）
		else if ((Date.now () - predictionNow) > 50) {
			window.clearInterval(timer)
			setGameFlg('init')
			navigateTo('/')
		}
		// もしカウントダウン数が０になったら
		else if (threeCount.value === 0) {
			// カウントダウンflgを終了
			setGameFlg('playing')
			// gameスタート音を鳴らす
			soundPlay(startSound)
			// setintevalを終了
			window.clearInterval(timer)
			// 制限時間カウントメソッドを作動
			countLimit()
			// １問目を出題
			getNextQuiz()
		}
		// もしカウントダウン数が０以下ではなかったらカウント音を鳴らす
		else if (gameFlg.value === 'count')	soundPlay(countSound)
	}, 1000)
}
/**
 * 制限時間をカウントダウンして０になったら得点集計、表示メソッドを呼び出す
 * @remarks
 *  ページを離脱した時やブラウザがsleepされた時はカウントダウンを中止するs
 */
const countLimit = () => {
	const { soundPlay,	countSound, endSound } = soundsUtil()
	countReset()
	const startDate = Date.now()
	const timer = window.setInterval(() => {
		// 制限時間から１を引く
		countTimer(countNum)
		const predictionNow = startDate + (TIME_LIMIT - countNum.value) * 1000
		// game途中でページ離脱した場合はsetintevalを終了
		if (gameFlg.value !== 'playing') {
			window.clearInterval(timer)
		}	// game途中でページsleep,復帰した場合はsetintevalを終了（スマホ対応）
		else if ((Date.now () - predictionNow) > 50) {
			window.clearInterval(timer)
			setGameFlg('init')
			navigateTo('/')
		}
		// 終了3秒前からカウント音を鳴らす
		if (4 > countNum.value && countNum.value > 0) soundPlay(countSound)
		// もしカウントダウン数が０になったら
		else if (countNum.value === 0) {
			// flgをgame終了に変更

			setGameFlg('finished')
		}
		else if (gameFlg.value === 'finished') {
			bonusTime.value = countNum.value
			// game終了音を鳴らす
			soundPlay(endSound)
			score()
			animeScore()
			// setintevalを終了
			window.clearInterval(timer)
		}
	}, 1000)
}
// ゲーム初期化時に問題を取得できていなかった場合はエラーページへ遷移
if (gameFlg.value === 'init') {
	if (questions.value === null || questions.value.length === 0) {
		throw createError({ statusCode: 500, fatal: true })
	}
}
</script>

<template>
	<div class="p-game">
		<div
			v-if="gameFlg === 'init'"
			class="p-game__container"
		>
			<RankingTable />
			<div
				class="p-game__button"
			>
				<button
					class="c-button c-button--game"
					type="button"
					:disabled="gameFlg !== 'init'"
					@click.prevent="gameStart"
				>
					GAME START
				</button>
			</div>
		</div>
		<div
			v-if="gameFlg==='count'"
			class="p-game__container"
		>
			<div
				class="p-game__area p-game__area--start"
			>
				{{ threeCount }}
			</div>
		</div>
		<div
			v-if="gameFlg==='playing'"
			class="p-game__container"
		>
			<ul class="p-game__area">
				<li
					v-for="(item, index) in currentWords"
					:key="index"
					v-moving
					class="p-game__item"
				>
					{{ item }}
				</li>
			</ul>

			<div class="p-game__input">
				<input
					v-model="anserWord"
					v-focus
					type="text"
					class="c-input c-input--anser"
					placeholder="please answer..."
					:maxlength="currentWords.length"
					@input="contentLengthCheck"
				/>
			</div>
			<p class="p-game__attention">
				半角英小文字で入力してください
			</p>
		</div>
		<div
			v-if="gameFlg==='finished'&&showScoreFlg"
			class="p-game__container"
		>
			<div

				class="p-game__score"
			>
				<h1
					class="c-head-line"
				>
					{{ displayScore }}
					<br />
				</h1>
				point!
			</div>
			<div
				class="p-game__button"
			>
				<NuxtLink
					:to="{ name: 'game', query: { category: 'color' } }"
					class="c-button c-button--game c-button--game-second"
					@click="gameRefresh(category!)"
				>
					もう一度Play

				</NuxtLink>
			</div>
			<div>
				<div class="p-game__button">
					<NuxtLink
						:to="{ name: 'index' }"
						class="c-button c-button--edit"
						@click="reset"
					>>>TOPへ戻る</nuxtlink>
				</div>
			</div>
		</div>
	</div>
</template>
