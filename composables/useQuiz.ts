import type { Question, WordCategory } from '~/types/types'
import type { AsyncDataRequestStatus } from '#app'

/** 出題単語リストを取得・管理するcomposable */
export const useQuiz = () => {
	const { reset, setGameFlg } = useGame()

	// serverから取得した単語リスト
	const questions = useState<Question[] | null>('questions')
	// serverとの通信状況
	const statusFlg = useState<Ref<AsyncDataRequestStatus> | null>('statusFlg')
	// cookieに保存するトークン
	const categoryToken = useCookie<string | null>('category', {
		maxAge: 60 * 60 * 24 * 7,
		secure: true,
	})
	/**
	 * 出題単語を取得するAPIエンドポイントにアクセスして単語データとトークンを取得する非同期処理
	 * @summary
	 *  取得した単語データのディープコピーを生成してquestionsに代入する
	 * （通信失敗で取得できなかったりデータが空だった場合は空配列を代入する）
	 * トークンはcookieに書き込む
	 *
	 * @param category 取得する単語リストのカテゴリー
	 */
	const gameInit = (category: WordCategory) => {
		reset()
		setGameFlg('init')
		questions.value = []
		const asyncData = useLazyFetch(`/quiz-management/quizzes/${category}`, {
			key: `/quiz-management/quizzes/${category}`,
		})
		const responseData = asyncData.data
		statusFlg.value = asyncData.status as Ref<AsyncDataRequestStatus>
		// 非同期通信の進行状況を監視して通信終了(success/error)を検知したらデータ取得処理を行う
		watch(
			() => statusFlg.value as AsyncDataRequestStatus | null,
			(newValue) => {
				if (newValue === 'success') {
					if (responseData.value !== undefined && responseData.value !== null && responseData.value.data !== null) {
						questions.value = JSON.parse(JSON.stringify(responseData.value.data))
						categoryToken.value = responseData.value.token
					}
					// 通信はできたが該当データの中身がなかった場合
					else {
						questions.value = []
					}
				}
				// 指定されたURL(APIserver)に通信できない
				else if (newValue === 'error') {
					questions.value = []
				}
			},
		)
	}
	/** 単語リスト取得処理が途中か否かを表すflg */
	const pendingFlg = computed((): boolean => {
		if (statusFlg.value as AsyncDataRequestStatus | null === 'pending') {
			return false
		}
		else {
			return true
		}
	})
	/**
 	* <もう一度Play>用の問題をserverキャッシュから再取得する
	* * @summary
	*  取得した単語データのディープコピーを生成してquestionsに代入する
	* （データが空だった場合は空配列を代入する）
	* トークンはcookieに書き込む
	*
	*  @param category 出題単語リストのカテゴリー
 	*/
	const gameRefresh = (category: WordCategory) => {
		reset()
		questions.value = []
		const chacheData = useNuxtData(`/quiz-management/quizzes/${category}`)
		const responseData = chacheData.data
		if (responseData.value !== undefined && responseData.value !== null && responseData.value.data !== null) {
			questions.value = JSON.parse(JSON.stringify(responseData.value.data))
			categoryToken.value = responseData.value.token
			setGameFlg('init')
		}
		// 該当データがキャッシュになかった場合
		else {
			questions.value = []
			setGameFlg('init')
		}
	}
	const anserWord = ref<string>('') // プレイヤーが入力した回答
	const missCount = ref<number>(0) // 誤回答数
	const clearCount = ref<number>(0) // 正解単語数
	const clearCharacter = ref<number>(0) // 正解文字数

	/** 単語リストからランダムに１単語を取り出す */
	const getNextQuiz = (): void => {
		if (!questions.value) {
			throw createError({ statusCode: 500, fatal: true })
		}
		const randomIndex = Math.floor(Math.random() * questions.value.length)
		const [question] = questions.value.splice(randomIndex, 1)
		currentQuestion.value = question
	}
	// 単語リストから取り出した１単語
	const currentQuestion = ref<Question | null>()
	// 1単語を配列に変換するメソッド
	const currentWords = computed((): string[] => {
		return [...currentQuestion.value!]
	})
	/**  残り問題の有無を算出してゲーム終了を検知するflg */
	const hasQuestion = computed((): boolean => {
		if (questions.value !== null && questions.value.length > 0) {
			return true
		}
		else {
			return	false
		}
	})

	/**
	 *  inputの入力文字数が正解文字数と一致したら答え合わせメソッドを発火させる
	 * 	@summary
	 * inputエレメントのイベントハンドラとして使用
	 * 文字数が一致したら日本語入力で未確定状態でも入力を強制終了して答え合わせをする
	 * 答え合わせ終了後は再度focusを充てる
	 *	@param event --イベント
	 */
	const contentLengthCheck = (event: Event) => {
		if (event.target instanceof HTMLInputElement) {
			if (event.target.value.length === currentWords.value.length) {
				event.target.blur()
				checkingAnswer()
				event.target.focus()
			}
		}
	}

	/** 答え合わせをする
	 * @summary
	 * 現在の出題１単語とプレイヤーが入力した回答が一致したら
	 * 正解単語数と正解文字数を加算して入力を空にする
	 * 次の単語が存在するなら読み込む（なければゲーム終了）
	 *
	 * 単語と入力が不一致の際は誤回答数を加算して入力を空にする
	 */
	const checkingAnswer = () => {
		const { soundPlay, ngSound, nextSound } = soundsUtil()
		if (currentQuestion.value! === anserWord.value) {
			soundPlay(nextSound)
			clearCharacter.value += currentQuestion.value!.length
			clearCount.value += 1
			anserWord.value = ''
			if (hasQuestion.value) {
				getNextQuiz()
			}
			else {
				setGameFlg('finished')
			}
		}
		else {
			soundPlay(ngSound)
			anserWord.value = ''
			missCount.value += 1
		}
	}

	return {
		anserWord, getNextQuiz, currentWords, checkingAnswer, contentLengthCheck, missCount, clearCount, clearCharacter, hasQuestion, gameInit, pendingFlg, questions, statusFlg, gameRefresh,

	}
}
