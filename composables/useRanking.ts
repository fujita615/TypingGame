import { getDatabase, ref as Ref, query, orderByChild, limitToLast, onValue, off } from 'firebase/database'
import type { RankingRecord, googleRequestStatus, ResponseRanking } from '@/types/types'

/** rankingBord用データを管理するcomposable */
export const useRanking = () => {
	const rankingBoard = useState<RankingRecord[]>('rankingBoard')
	const requestRankingStatusFlg = useState<googleRequestStatus>('requestRankingStatusFlg')
	const db = getDatabase()
	const rankingRef = query(Ref(db, 'ranking/'), orderByChild('score'), limitToLast(3))
	/**
    *[firebase] rankngコレクションを3個取得してスコア順に並べ替える
    */
	const getRankingBoard = async () => {
		requestRankingStatusFlg.value = 'pending'
		onValue(rankingRef, (snapshot) => {
			const result: ResponseRanking = snapshot.val()

			// 取得したobjectをランキング表示用に加工
			const arr: RankingRecord[] = []
			for (const item in result) {
				arr.unshift(result[item])
			}
			// score降順にsortする
			arr.sort((a, b) => b.score - a.score)

			// 取得データが空以外なら通信flgをsuccessにして表示用リアクティブ変数に代入
			if (arr[0].score !== null && arr[0].score !== undefined) {
				requestRankingStatusFlg.value = 'success'
				rankingBoard.value = arr
			}
			else {
				// 取得データが空だった場合は通信errorをflgで表す
				requestRankingStatusFlg.value = 'error'
				rankingBoard.value = []
				unsubscribeRankingBoard()
			}
		}, (error) => {
			requestRankingStatusFlg.value = 'error'
			rankingBoard.value = []
			unsubscribeRankingBoard()
		})
	}

	/** [firebase]RankngRefの監視を解除する */
	const unsubscribeRankingBoard = () => {
		off(rankingRef)
	}

	return {
		getRankingBoard, rankingBoard, requestRankingStatusFlg, unsubscribeRankingBoard,
	}
}
