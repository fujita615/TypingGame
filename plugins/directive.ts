export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('focus', {
		// page読み込み時にinputタグをfocus状態にするカスタムディレクティブ
		mounted(el) {
			el.focus()
			return
		},
	})
})
