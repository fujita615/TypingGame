import type { Question, ReternJSONQuizzes } from '@/types/types'
/** 出題単語リストを提供するサーバーAPIエンドポイント */
export default defineEventHandler(
	/** DBサーバーから出題単語リストを取得してトークンと併せて送信する
	 * @summary
	 * URLのqueryパラメータで指定されたカテゴリーをkey名にしてredisサーバーから
	 * 出題単語リストを取得。jsonに変換してレスポンスする
	 *
	 * @params event - H3イベントオブジェクト
	 * @returns token - トークン（出題単語のカテゴリー）
	 * @returns data - 出題単語リスト
	*/
	async (event): Promise<ReternJSONQuizzes> => {
		const params = event.context.params
		let quizDrill: Question[] = []
		let token = ''

		const storage = useStorage('redis')

		const quizzesStorage = await storage.getItem(`${params?.category}`)
		// サーバーからデータを取得できなかった場合は空配列をjsonデータに変換する
		if (quizzesStorage !== undefined) {
			quizDrill = quizzesStorage as Question[]
			token = params!.category
		}
		return {
			token: token,
			data: quizDrill,
		}
	},
)
