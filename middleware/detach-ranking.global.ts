/** gameページを離脱する時にランキングデータの監視を解除する */
export default defineNuxtRouteMiddleware((to, from) => {
	const { unsubscribeRankingBoard } = useRanking()
	const { reset } = useGame()
	if (from.name === 'game') {
		unsubscribeRankingBoard()
		reset()
	}
	return
})
