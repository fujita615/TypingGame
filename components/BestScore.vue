<!-- ログイン中に表示されるプレイヤーのベストスコア（NuxtIconを利用） -->
<script setup lang='ts'>
import type { RankerIndex } from '@/types/types'

const { registeredData } = useUser()
const { rankingBoard } = useRanking()
const index = ref<RankerIndex>(-1) /** ランキング順位 */
/** ランキング1,2,3位を表すアイコンのname属性 */
const rank = ['clarity:crown-line', 'fluent-emoji-high-contrast:2nd-place-medal', 'fluent-emoji-high-contrast:3rd-place-medal']

// プレイヤー名と現在のランキングを監視して、順位を表すindexを取得する
watch(
	[() => registeredData.value.nickname, () => rankingBoard.value],
	([newName, newRanking]) => {
		if (newName !== '') {
			index.value = newRanking.findIndex(item => item.nickname === newName) as RankerIndex
		}
		else {
			index.value = -1
		}
	},
	{ immediate: true },
)
</script>

<template>
	<li
		v-if="registeredData.score !==0"
		class="c-icon c-icon--bestscore"
	>
		&nbsp;&nbsp;BEST SCORE&nbsp;&nbsp;
		<span class="c-icon c-icon--score">
			{{ registeredData.score }}&nbsp;
		</span>
	</li>
	<!-- ランキング1,2,3位はアイコンも併せて表示） -->
	<li
		v-if="index >=0&& index <=2"
		class="c-icon c-icon--score"
	>
		<Icon :name="rank[index]" />
	</li>
</template>
