import type { FlashMessage } from '@/types/types'

/** Flashメッセージを管理するcomposable */
export const useMessage = () => {
	const flashMessage = useState<FlashMessage>('flashMessage')// 表示する文章
	/**
	 * 注意喚起メッセージを表示する
	 * @param  message --表示する文章
	 * @param  timeout --表示する秒数(デフォルトは3秒)
	 */
	const setAlert = (message: string, timeout = 3000) => {
		flashMessage.value.alert = message
		setTimeout(() => (flashMessage.value.alert = ''), timeout)
	}
	/**
	 * 成功メッセージを表示する
	 * @param  message --表示する文章
	 * @param  timeout --表示する秒数(デフォルトは3秒)
	 */
	const setSuccess = (message: string, timeout = 3000) => {
		flashMessage.value.success = message
		setTimeout(() => (flashMessage.value.success = ''), timeout)
	}
	return {
		flashMessage,
		setAlert,
		setSuccess,
	}
}
