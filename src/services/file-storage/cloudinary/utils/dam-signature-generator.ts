export const damSignatureGenerator = async (
	parameters: Array<{
		name: string
		value: string | undefined
	}>,
	apiSecret: string,
): Promise<string> => {
	parameters.push({ name: 'timestamp', value: String(new Date().getTime()) })
	parameters.sort((a, b) => {
		if (a.name > b.name) {
			return 1
		}
		if (a.name < b.name) {
			return -1
		}
		return 0
	})

	let signature = ''
	for (let i = 0; i < parameters.length; i++) {
		const parameter = parameters[i]
		signature += parameter.name + '=' + parameter.value
		i === parameters.length - 1 ? (signature += apiSecret) : (signature += '&')
	}

	return await sha256ToHex(signature)
}

const sha256ToHex = async (payload: string): Promise<string> => {
	const encoder = new TextEncoder()
	const payloadUint8 = encoder.encode(payload) // encode as (utf-8) Uint8Array

	let payloadBuffer: ArrayBuffer = new ArrayBuffer(0)
	try {
		payloadBuffer = await crypto.subtle.digest('SHA-256', payloadUint8) // hash the message
	} catch (error) {
		throw new Error('Error hashing the message')
	}
	const payloadArray = Array.from(new Uint8Array(payloadBuffer)) // convert buffer to byte array
	const payloadHex = payloadArray
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('') // convert bytes to hex string
	return payloadHex
}
