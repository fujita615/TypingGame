import countsound from '@/assets/sounds/s01.mp3'
import startsound from '@/assets/sounds/s02.mp3'
import nosound from '@/assets/sounds/s03.mp3'
import endsound from '@/assets/sounds/s04.mp3'
import nextsound from '@/assets/sounds/s05.mp3'

/** 音源を管理するutil */
export const soundsUtil = () => {
	/** 効果音を鳴らす
	 * @param sound - 効果音データ
	 */
	const soundPlay = (sound: HTMLAudioElement) => {
		sound.currentTime = 0// 音声の再生位置を０にする（Audioクラスのメソッド）（最初にリセットする）
		sound.play()// 音声再生
	}
	const countSound = new Audio(countsound)
	const startSound = new Audio(startsound)
	const ngSound = new Audio(nosound)
	const nextSound = new Audio(nextsound)
	const endSound = new Audio(endsound)

	return {
		soundPlay, countSound, startSound, ngSound, nextSound, endSound,
	}
}
