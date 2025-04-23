import type { WordCategory } from '@/types/types'

/**  問題の種類（カテゴリー）を管理するcomposable */
export const useCategory = () => {
	const category = useState<WordCategory | null>('category')
	return {
		category: readonly(category),
	}
}
