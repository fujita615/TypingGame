/** 日付、時間を管理するUtil */
export const dateUtil = () => {
	const d = new Date()
	const dstr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-'
		+ d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
	const timestamp = d.getTime()

	const today = d.getFullYear().toString() + '/' + (d.getMonth() + 1).toString() + '/' + d.getDate().toString()

	return {
		dstr, timestamp, today,
	}
}
