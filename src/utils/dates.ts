const LANG = "fr"

const RELATIVE_TIME_FORMATER = new Intl.RelativeTimeFormat(LANG, {
	style: "long",
	numeric: "auto",
})
const ABSOLUTE_TIME_FORMATER = new Intl.DateTimeFormat(LANG, {
	dateStyle: "long",
	timeStyle: "short",
	timeZone: "UTC",
})
const HOUR_TIME_FORMATER = new Intl.DateTimeFormat(LANG, {
	timeZone: "UTC",
	hour: "numeric",
	minute: "numeric",
})

type Cache = { [id: string]: string }
let convertedDatetimeCache: Cache = {}

export function convertPbDatetime(datetime: string): string {
	const CONVERTED_DATE = new Date(datetime)
	const TODAY_DATE = new Date().getDate()
	const HOUR = HOUR_TIME_FORMATER.format(new Date())

	if (CONVERTED_DATE.getDate() === TODAY_DATE) return `Aujourd'hui à ${HOUR}`
	else if (CONVERTED_DATE.getDate() === TODAY_DATE - 1)
		return `Hier à ${HOUR}`
	else if (CONVERTED_DATE.getDate() === TODAY_DATE - 2)
		return `Avant-hier à ${HOUR}`

	return ABSOLUTE_TIME_FORMATER.format(CONVERTED_DATE)
}

export function convertRelativePbDatetime(datetime: string): string {
	if (datetime in convertedDatetimeCache) {
		return convertedDatetimeCache[datetime]
	}

	let convertedDate = new Date(datetime)
	const now = new Date()

	let unit: Intl.RelativeTimeFormatUnit = "day"

	type TimeAgoByUnit = { [id: string]: number }
	const timeAgo: TimeAgoByUnit = {
		days: convertedDate.getDate() - now.getDate(),
		hours: convertedDate.getHours() - now.getHours(),
		minutes: convertedDate.getMinutes() - now.getMinutes(),
		seconds: convertedDate.getSeconds() - now.getSeconds(),
	}

	if (timeAgo.days != 0) {
		unit = "days"
	} else if (timeAgo.hours != 0) {
		unit = "hours"
	} else if (timeAgo.minutes != 0) {
		unit = "minutes"
	} else if (timeAgo.seconds != 0) {
		unit = "seconds"
	} else {
		return ABSOLUTE_TIME_FORMATER.format(convertedDate)
	}

	const result = RELATIVE_TIME_FORMATER.format(timeAgo[unit], unit)
	convertedDatetimeCache[datetime] = result

	return result
}
