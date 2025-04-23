<!-- 全ユーザーのベストスコアランキング表 -->
<script setup lang="ts">
const { rankingBoard } = useRanking()
const { today } = dateUtil()
/** 1,2,3位を表すアイコンのname属性（NuxtIcon） */
const rank = ['clarity:crown-line', 'iconamoon:number-2-bold', 'iconamoon:number-3-bold']
</script>

<template>
	<h3
		class="c-sub-heading p-table__head"
	>
		BestScoreRanking &nbsp;
	</h3>
	<div class="p-table__container">
		<p v-if="rankingBoard.length === 0">
			現在ranking機能はご利用いただけません。<br />
			game自体はご利用いただけます
		</p>
		<table
			v-if="rankingBoard !== undefined && rankingBoard !== null && rankingBoard.length !== 0"
			class="p-game__Ranking p-table"
		>
			<tr
				v-for="(item, index) in rankingBoard"
				:key="index"
			>
				<th class="p-table__column">
					<Icon :name="rank[index]" />
				</th>
				<td class="p-table__column">
					{{ item.nickname }}
				</td>
				<td class="p-table__column">
					{{ item.score }}&nbsp;&nbsp; <small>points</small>
				</td>
			</tr>
			<caption
				v-if="today"
				class="p-table__caption"
			>
				{{ today }}現在
			</caption>
		</table>
	</div>
	<p class="p-table__description">
		<strong>【集計方法】正解単語数ー不正解単語数</strong><br />
		*ボーナスpoint*&nbsp;&nbsp;正解単語の文字数✖️２
		<br />*ボーナスpoint*&nbsp;&nbsp;全問正解時の残り時間
	</p>
</template>
