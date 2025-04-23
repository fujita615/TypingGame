/* eslint-disable @typescript-eslint/no-unused-vars */

const GOOGLEREQUEST_STATUS = ['init', 'success', 'pending', 'error'] as const
/** GoogleAPIとの通信状況 */
export type googleRequestStatus = (typeof GOOGLEREQUEST_STATUS)[number]

/** 登録ユーザー情報 */
export interface Ranker {
	nickname: string
	score: number
	uid: string
	key: string
}
/** 登録ユーザー名の最大文字数 */
export const NICKNAME_MAX = 8

/** 登録更新APIへの送信データ */
export interface UpdateData {
	nickname: string
	score?: number
	posted?: string
}

/** firebaseから取得したランキングデータのデータ形式 */
export interface ResponseRanking {
	[key: string]: RankingRecord
}
const RUNKER_INDEX = [-1, 0, 1, 2] as const
/**  Rankingの順位 1位=> 0, 2位=> 1, 3位=> 2, 該当なし=> -1 */
export type RankerIndex = (typeof RUNKER_INDEX)[number]

/** １ユーザーの登録名とベストスコア */
export interface RankingRecord {
	nickname: string
	score: number
}

const WORD_CATEGORY = ['color'] as const
/**  出題単語のカテゴリー */
export type WordCategory = (typeof WORD_CATEGORY)[number]

/** 出題1単語 */
export type Question = string

/** APIから出題単語リストを取得する際のデータ形式 */
export interface ReternJSONQuizzes {
	/** 出題単語リスト */
	data: Question[]
	/** アクセストークン */
	token: string
}
const GAME_STATUS = ['init', 'count', 'playing', 'finished'] as const
/** Gameの進行状況 */
export type GameStatus = (typeof GAME_STATUS)[number]

/** gameの制限時間 */
export const TIME_LIMIT = 20 as const
export type TimeLimit = typeof TIME_LIMIT

/** 文字アニメーションの種類 */
export type animationItems = 'turn' | 'pin' | 'role' | 'step' | 'scale_up'

/** 文字アニメーションの出現確率(少ないほど高確率) */
export const LEVEL = 30
// モーダルの種類
const MODAL = ['welcome', 'userEdit', 'userDelete'] as const
export type Modal = (typeof MODAL)[number]
/** モーダルの名前と開閉を指定するFlg */
export type modalFlg = Record<Modal, {
	isShow: boolean
}>

/**  Flashメッセージで表示する文章と種類(success,alert) */
export type FlashMessage = Record<message, string>
// メッセージの種類
const MESSAGE = ['success', 'alert'] as const
export type message = (typeof MESSAGE)[number]
