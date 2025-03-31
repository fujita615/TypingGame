import type { WordCategory } from '@/types/types'

/** gameページに遷移する前に出題単語リスト取得APIエンドポイントにアクセスする */
export default defineNuxtRouteMiddleware(async (to, from) => {
	const category = useState<WordCategory | null>('category')
	const { gameInit } = useQuiz()
	const { getRankingBoard } = useRanking()

	// TOPページ以外から直接アクセスされた時はTOPページへリダイレクト
	if (from.name !== 'index') {
		return await navigateTo('/')
	}
	// queryで指定されたcategoryをstateに代入
	else if (to.query.category === 'color') {
		category.value = to.query.category
		// 指定したcategoryの問題とrankingを取得しつつ,gameページへ遷移
		gameInit(to.query.category)
		getRankingBoard()
		return
	}
	// URLのqueryパラメータが指定されてなかったり用意されていない値だった場合はTOPページへリダイレクト
	else {
		return	await navigateTo('/')
	}
})
