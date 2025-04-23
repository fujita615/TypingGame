import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, deleteUser, onAuthStateChanged, type User } from 'firebase/auth'
import { getDatabase, get, set, push, ref as Ref, query, orderByChild, equalTo, remove, update } from 'firebase/database'

import type { Ranker, RankingRecord, googleRequestStatus, UpdateData } from '@/types/types'
import { NICKNAME_MAX } from '@/types/types'

/** ユーザーデータを管理するcomposable */
export const useUser = () => {
	const { dstr } = dateUtil()// 日付
	const { setSuccess, setAlert } = useMessage()
	const { myScore } = useGame()
	const categoryToken = useCookie<string | null>('category', {
		secure: true,
	})
	const requestUserStatusFlg = useState<googleRequestStatus>('requestUserStatusFlg')
	const showScoreFlg = useState<boolean>('showScoreFlg')

	const validation = useState<string>('validation')
	const registeredData = useState<Ranker>('registeredData')

	const inputNickname = useState<string>('inputNickname')
	const { openModal, closeModal } = useModalComponent()
	const db = getDatabase() // [firebase]のdatabaseオブジェクト
	const auth = getAuth() // [firebase]のauthオブジェクト
	const provider = new GoogleAuthProvider() // Google の認証プロバイダーをインスタンス化

	// firebaseの認証処理の通信状況を表すflg
	const requestAuthStatusFlg = useState<boolean>('requestAuthStatusFlg')
	/** アプリへのログイン状態を表すflg */
	const isLogin = computed(() => {
		if (registeredData.value.uid !== '' && registeredData.value.nickname !== '') {
			return true
		}
		else {
			return false
		}
	})
	/**
	* ユーザー登録/変更フォームの入力値、ログインデータを初期化する
	*/
	const resetData = () => {
		registeredData.value = { key: '', nickname: '', score: 0, uid: '' }
		inputNickname.value = ''
	}
	/**
    * ユーザー登録/変更フォームを呼びだす
    */
	const showUserForm = () => {
		requestUserStatusFlg.value = 'init'
		inputNickname.value = ''
		validation.value = ''
		if (registeredData.value.nickname !== '') {
			inputNickname.value = registeredData.value.nickname
		}
		openModal('userEdit')
	}
	/** [firebase]現在のgoogleログイン情報を取得する */
	const getCurrentFireBaseUser = (): Promise<User | null> => {
		return new Promise((resolve) => {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				resolve(user)
				unsubscribe()
			})
		})
	}

	/**
	 * [firebase]googleアカウントの状態を確認してログインしていたらアプリのユーザーデータ取得メソッドを呼び出す
	 */
	const checkUserLogin = () => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				registeredData.value.uid = user.uid
				// 既にloginしていたらアプリのユーザーデータ取得メソッドを呼ぶ
				getUserData(registeredData.value.uid)
			}
			requestAuthStatusFlg.value = true
		})
	}

	/**
    *[firebase] googleにloginしてからアプリのユーザーデータ取得メソッドを呼び出す
    */
	const loginGoogle = async (): Promise<void> => {
		try {
			// Google のログインポップアップを表示し、ユーザー認証
			requestUserStatusFlg.value = 'pending'
			await signInWithPopup(auth, provider).then((result) => {
				registeredData.value.uid = result.user.uid
				getUserData(registeredData.value.uid)
			})
		}
		catch (error) {
			requestUserStatusFlg.value = 'error'
			setAlert('現在ログインできない状況ですが,ゲームはPlay可能です', 6000)
			resetData()
			clearError()
		}
	}
	/**
    *[firebase] ユーザーデータを取得、代入する(登録がない場合は初期値(空文字)を代入)
		@param uid - firebaseに割り振られるid
    */
	const getUserData = async (uid: string): Promise<void> => {
		try {
			requestUserStatusFlg.value = 'pending'
			const nickNameRef = query(Ref(db, 'users/'), orderByChild('uid'), equalTo(uid))
			const response = await get(nickNameRef)
			const arr = []
			const result = await response.val()
			for (const item in result) {
				const arraykey = result[item].key
				// ネストされたnicknameとscoreをフラットにする
				result[item]['nickname'] = result[item][arraykey].nickname
				result[item]['score'] = result[item][arraykey].score
				arr.unshift(result[item])
			}

			if (result) {
				registeredData.value.key = arr[0].key
				registeredData.value.nickname = arr[0].nickname
				registeredData.value.score = arr[0].score
				inputNickname.value = arr[0].nickname
			}
			else {
				// ユーザー登録がない場合は登録フォームを呼びだす
				inputNickname.value = ''
				openModal('userEdit')
			}
			requestUserStatusFlg.value = 'init'
		}
		catch (error) {
			// firebaseと通信できなかった場合
			requestUserStatusFlg.value = 'error'
			setAlert('現在ログインできない状況ですが,ゲームはPlay可能です', 6000)
			signOut(auth)
			resetData()
			clearError()
		}
	}
	/**
	 * ユーザー登録フォームの入力をバリデーションする
	 */
	const validationNickName = () => {
		requestUserStatusFlg.value = 'init'
		validation.value = ''
		if (inputNickname.value === '') {
			validation.value = '入力必須項目です'
			return false
		}
		if (inputNickname.value.length > NICKNAME_MAX) {
			validation.value = '最大文字数を超えています'
			return false
		}
		if (registeredData.value.nickname !== '' && inputNickname.value === registeredData.value.nickname) {
			validation.value = '現在の登録名と同じ名前です'
		}
		if (validation.value !== '') return false
		// バリデーションを通過したら
		if (registeredData.value.nickname === '') {
			// 新規登録
			registerNickname()
		}
		else {
			// 登録変更
			updateNickName()
		}
	}
	/**
    *[firebase]users,ranking,nicknameコレクションにnicknameとscore(初期値0)を新規登録する
    */
	const registerNickname = async () => {
		try {
			requestUserStatusFlg.value = 'pending'
			// nicknameとscore登録用にユニークkeyを準備
			// ユニークkeyが無い場合はfirebaseから取得
			if (registeredData.value.key === '') {
				registeredData.value.key = push(Ref(db, 'ranking/')).key!
				if (registeredData.value.key === '' && !registeredData.value.key) {
					// 通信成功なのにkeyを取得できなかった場合はerror処理
					throw createError({ statusCode: 500, fatal: true })
				}
			}
			// 利用したいnicknameをnickname-listに登録（既に他ユーザーが登録済みnicknameだった場合はerrorが返却される）
			await set(Ref(db, `nickname-list/${inputNickname.value}`), { key: registeredData.value.key })
			// usersとrankingにレコードを新規登録
			await set(Ref(db, `users/${registeredData.value.uid}`), { uid: registeredData.value.uid, key: registeredData.value.key, [registeredData.value.key]: { nickname: inputNickname.value, score: registeredData.value.score } })
			await set(Ref(db, `ranking/${registeredData.value.key}`), { score: myScore.value, nickname: inputNickname.value, posted: dstr })
			registeredData.value.nickname = inputNickname.value
			closeModal('userEdit')
			requestUserStatusFlg.value = 'init'
		}
		catch (error) {
			validation.value = '既に別の利用者がいる登録名です'
			requestUserStatusFlg.value = 'init'
			return false
		}
	}
	/**
    *[firebase]ユーザー新規登録をキャンセルする
    */
	const cancelRegisterNickName = async () => {
		if (auth.currentUser) {
			try {
				requestUserStatusFlg.value = 'pending'
				await deleteUser(auth.currentUser)
				resetData()
				requestUserStatusFlg.value = 'init'
			}
			catch (error) {
				requestUserStatusFlg.value = 'error'
				// 通信成功なのにkeyを取得できなかった場合はerrorページへ
				throw createError({ statusCode: 500, fatal: true })
			}
		}
	}
	/**
    *[firebase]users,ranking,nicknameコレクションにnicknameを変更登録する
    */
	const updateNickName = async () => {
		try {
			requestUserStatusFlg.value = 'pending'
			// 利用したいnicknameをnickname-listに登録（既に他ユーザーが登録済みnicknameだった場合はerrorが返却される）
			await set(Ref(db, `nickname-list/${inputNickname.value}`), { key: registeredData.value.key })

			const updateNickname: UpdateData = {
				nickname: inputNickname.value,
				score: registeredData.value.score,
			}

			const updates: Record<string, UpdateData> = {}

			updates['/users/' + registeredData.value.uid + '/' + registeredData.value.key] = updateNickname
			updates['/ranking/' + registeredData.value.key] = updateNickname
			await update(Ref(db), updates)
			if (registeredData.value.nickname !== inputNickname.value && registeredData.value.nickname !== '') {
				await remove(Ref(db, `nickname-list/${registeredData.value.nickname}`))
			}
			registeredData.value.nickname = inputNickname.value
			closeModal('userEdit')
			requestUserStatusFlg.value = 'init'
		}
		catch (error) {
			validation.value = '既に別の利用者がいる登録名です'
			requestUserStatusFlg.value = 'init'
			return false
		}
	}

	/**
    *[firebase]ベストスコア登録を更新する
	* @summary
	* rankingコレクションとusersコレクションのスコアを一括更新する非同期処理
	* 通信失敗時はAlert表示をしつ、ログアウト処理を行う
    */
	const updateScore = async () => {
		try {
			requestUserStatusFlg.value = 'pending'
			const updateScore: RankingRecord = {
				score: myScore.value,
				nickname: registeredData.value.nickname,
			}

			const EnterTheDate: UpdateData
			= { score: myScore.value,
				nickname: registeredData.value.nickname,
				posted: dstr,
			}
			const updates: Record<string, UpdateData> = {}

			updates['/users/' + registeredData.value.uid + '/' + registeredData.value.key] = updateScore
			updates['/ranking/' + registeredData.value.key] = EnterTheDate
			await update(Ref(db), updates)
			registeredData.value.score = myScore.value
			requestUserStatusFlg.value = 'init'
		}
		catch (error) {
			requestUserStatusFlg.value = 'error'
			setAlert('システムエラーによりscoreを登録できませんでした', 6000)
			signOut(auth)
			clearError()
		}
	}
	/**
	 * [fireBase]アプリとgoogleからlogoutする
	 */
	const logout = async (): Promise<void> => {
		const currentFireBaseUser = await getCurrentFireBaseUser()
		// signout()でlogoutし終わったらvueで保存しているdataを書き換える
		if (currentFireBaseUser) {
			try {
				requestUserStatusFlg.value = 'pending'
				await signOut(auth)
			}
			finally {
				resetData()
				requestUserStatusFlg.value = 'init'
				setSuccess('またのご利用を心よりお待ちしております', 3000)
			}
		}
		else {
			// 既にログインが切れていた場合は
			resetData()
			setSuccess('またのご利用を心よりお待ちしております', 3000)
		}
	}
	/** ユーザーアカウントを削除する */
	const deleteGoogle = async (): Promise<void> => {
		closeModal('userDelete')
		// Google のログインポップアップを表示し、ユーザー認証
		if (auth.currentUser) {
			try {
				requestUserStatusFlg.value = 'pending'
				if (registeredData.value.nickname === '' || registeredData.value.key === '') {
					await getUserData(auth.currentUser.uid)
				}
				if (registeredData.value.nickname !== '' && registeredData.value.key !== '') {
					await remove(Ref(db, `users/${registeredData.value.uid}`))
					await remove(Ref(db, `ranking/${registeredData.value.key}`))
					await remove(Ref(db, `nickname-list/${registeredData.value.nickname}`))
					await deleteUser(auth.currentUser)
					resetData()
					requestUserStatusFlg.value = 'init'
					setSuccess('またのご利用を心よりお待ちしております', 3000)
					await navigateTo('/')
					categoryToken.value = null
				}
			}
			catch (error) {
				requestUserStatusFlg.value = 'error'
				// 処理失敗の場合はerrorページへ
				throw createError({ statusCode: 500, fatal: true })
			}
		}
		else {
			// ログインが切れていたら
			setAlert('ログイン後、あらためて操作してください', 3000)
			requestUserStatusFlg.value = 'init'
			resetData()
			await navigateTo('/')
		}
	}
	/** ユーザー登録変更を中止してフォームを閉じる */
	const closeUserForm = () => {
		if (registeredData.value.nickname === '') {
			cancelRegisterNickName()
		}
		closeModal('userEdit')
	}
	return {
		showScoreFlg, requestAuthStatusFlg, cancelRegisterNickName, checkUserLogin, isLogin, loginGoogle, registeredData, updateScore, inputNickname, registerNickname, updateNickName, validation, validationNickName, logout, deleteGoogle, showUserForm, closeUserForm, getUserData, requestUserStatusFlg,
	}
}
