export async function askNotificationPermission() {
	console.trace()

	throw new Error("askNotificationPermission()")
	if (!("Notification" in window)) {
		console.warn("This browser does not support notifications.")
		return
	}

	await Notification.requestPermission()
}

export const VALID_IMAGES_TYPES = ".png, .jpg, .webp, .gif"
export function isValidImage(file: File): boolean {
	return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
		file.type,
	)
}
