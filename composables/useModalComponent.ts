import type { modalFlg } from '@/types/types'

/** モーダル表示を管理するcomposable */
export const useModalComponent = () => {
	const modalFlg = useState<modalFlg>('modalFlg')	// 各モーダルの開閉を指定するflg
	/**
	 * 引数で指定したモーダルを開く
	 * @param  modalName --開くモーダルの名前
	 */
	const openModal = (modalName: keyof typeof modalFlg.value) => {
		return (modalFlg.value[modalName].isShow = true)
	}
	/**
	 * 引数で指定したモーダルを閉じる
	 * @param  modalName --閉じるモーダルの名前
	 */
	const closeModal = (modalName: keyof typeof modalFlg.value) => {
		return (modalFlg.value[modalName].isShow = false)
	}
	return {
		openModal, closeModal, modalFlg,
	}
}
