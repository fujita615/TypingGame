<script setup lang="ts">
import type { Ref } from 'vue'
import type { AsyncDataRequestStatus } from '#app'
import type { Question, GameStatus, WordCategory, googleRequestStatus, RankingRecord, Ranker, modalFlg, FlashMessage, TimeLimit } from '@/types/types'
import { TIME_LIMIT } from '@/types/types'

/** googleアカウントのログイン有無の確認が完了しているかを表すFlg */
useState<boolean>('requestAuthStatusFlg', (): boolean => {
	return false
})
/** ユーザー情報取得APIとの通信状況 */
useState<googleRequestStatus>('requestUserStatusFlg', (): googleRequestStatus => {
	return 'init'
})
/** 登録ユーザー情報 */
useState<Ranker>('registeredData', (): Ranker => {
	return {
		uid: '',
		score: 0,
		nickname: '',
		key: '',
	}
})
/** ユーザー登録・変更フォームの入力値 */
useState<string>('inputNickname', (): string => {
	return ''
})
/** バリデーションエラーメッセージ */
useState<string>('validation', (): string => {
	return ''
})
/** ランキング取得APIとの通信状況 */
useState<googleRequestStatus>('requestRankingStatusFlg', (): googleRequestStatus => {
	return 'init'
})
/** ベストスコアランキング */
useState<RankingRecord[]>('rankingBoard', (): RankingRecord[] => {
	return []
})
/** 出題される単語リストのカテゴリー（問題取得時に指定） */
useState<WordCategory | null>(
	'category',
	(): WordCategory | null => {
		return null
	},
)
/** APIから取得した出題単語リスト */
useState<Question[] | null>(
	'questions',
	(): Question[] | null => {
		return null
	},
)
/** 単語リスト取得APIとの非同期処理の状況を表すFlg */
useState<Ref<AsyncDataRequestStatus> | null>(
	'statusFlg',
	(): Ref<AsyncDataRequestStatus> | null => {
		return null
	},
)
/** ゲームの進行状況を表すFlg */
useState<GameStatus>(
	'gameFlg',
	(): GameStatus => {
		return 'init'
	},
)
/** ゲームスタートへのカウントダウン */
useState<number>(
	'threeCount',
	(): number => {
		return 3
	},
)
/** ゲーム制限時間 */
useState<TimeLimit>(
	'countNum',
	(): TimeLimit => {
		return TIME_LIMIT
	},
)
/** スコア集計完了を表すFlg */
useState<boolean>('showScoreFlg', (): boolean => {
	return false
})
/** アニメーション表示用スコア */
useState<number>('displayScore', (): number => {
	return 0
})
/** 獲得スコア */
useState<number>('myscore', (): number => {
	return 0
})
/** モーダルの名前と開閉を指定するFlg */
useState<modalFlg>('modalFlg', (): modalFlg => {
	return {
		welcome: { isShow: false },
		userEdit: { isShow: false },
		userDelete: { isShow: false },
	}
})
/** Flashメッセージに表示する文章と種類 **/
useState<FlashMessage>('flashMessage', (): FlashMessage => {
	return {
		alert: '', // 注意メッセージ
		success: '', // 成功メッセージ
	}
})
const { pendingFlg } = useQuiz()
const { requestRankingStatusFlg } = useRanking()
const { requestUserStatusFlg, checkUserLogin, requestAuthStatusFlg } = useUser()
const { modalFlg } = useModalComponent()

onMounted(() => {
	if (requestAuthStatusFlg.value === false) {
		checkUserLogin()
	}
})
</script>

<template>
	<NuxtLayout>
		<main class="l-main">
			<!-- 非同期処理の終了を待機する画面 -->
			<div
				v-if="!pendingFlg || requestRankingStatusFlg ==='pending' || requestUserStatusFlg=== 'pending'"
				class="p-loader"
			>
				<div class="p-loader__message">
					<LoaderComponent>
						<template #body />
					</LoaderComponent>
				</div>
			</div>
			<NuxtPage v-else />

			<!-- Flashメッセージ -->
			<MessageComponent />
			<!-- ページランディング時に表示する注意書きモーダル -->
			<WelcomeModal v-show="modalFlg.welcome.isShow" />
			<!-- ユーザー名登録(変更)フォーム -->
			<EditUser v-show="modalFlg.userEdit.isShow" />
			<!-- ユーザー登録削除フォーム -->
			<DeleteUser v-show="modalFlg.userDelete.isShow" />
		</main>
	</NuxtLayout>
</template>
