/** サイト訪問時にgoogleアカウントのログイン確認処理の状況とgameの進行状況を初期化する */
export default defineNuxtRouteMiddleware((to, from) => {
	const { requestAuthStatusFlg } = useUser()
	const { setGameFlg } = useGame()
	setGameFlg('init')
	if (from.name !== 'game' && from.name !== 'privacyPolicy' && from.name !== 'index') {
		requestAuthStatusFlg.value = false
	}
	return
})
