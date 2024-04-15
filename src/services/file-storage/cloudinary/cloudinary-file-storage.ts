import { FileStorage } from '../file-storage'
import { damSignatureGenerator } from './utils/dam-signature-generator'

export class CloudinaryFileStorage implements FileStorage {
	constructor(
		private apiKey: string,
		private apiSecret: string,
		private cloudName: string,
	) {}

	async upload({
		image,
		optionalParams,
		resourceType = 'image',
	}: {
		image: string
		optionalParams: Array<{ name: string; value: string }>
		resourceType?: string
		apiKey: string
		apiSecret: string
		cloudName: string
	}) {
		try {
			const signature = await damSignatureGenerator(
				optionalParams,
				this.apiSecret,
			)

			const formData = new FormData()
			formData.append('api_key', this.apiKey)
			formData.append('file', image)
			formData.append('resource_type', resourceType)
			formData.append('signature', signature)
			optionalParams.forEach((param) =>
				formData.append(param.name, param.value),
			)

			const fetchResponse = await fetch(
				`https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`,
				{
					method: 'POST',
					body: formData,
				},
			)

			if (fetchResponse.status === 200) {
				const result: { [key: string]: string } =
					(await fetchResponse.json()) as { [key: string]: string }

				const {
					height,
					format,
					original_filename,
					public_id,
					secure_url,
					url,
					width,
				} = result

				const file = {
					dimensions: {
						height: Number(height),
						width: Number(width),
					},
					file_name: public_id.split('/').pop() + '.' + format,
					format,
					original_filename,
					public_id,
					secure_url,
					url,
				}

				return {
					url: file.url,
				}
			}

			throw new Error('Error cloudinaryFileDAM.upload')
		} catch (error) {
			throw new Error('Error cloudinaryFileDAM.upload')
		}
	}

	async delete({
		publicId,
		resourceType = 'image',
	}: {
		publicId: string
		resourceType: string
		apiKey: string
		apiSecret: string
		cloudName: string
	}) {
		const parameters = [{ name: 'public_id', value: publicId }]

		const signature = await damSignatureGenerator(parameters, this.apiSecret)

		const formData = new FormData()
		formData.append('api_key', this.apiKey)
		formData.append('resource_type', resourceType)
		formData.append('signature', signature)
		parameters.forEach((param) => formData.append(param.name, param.value))

		const fetchResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/destroy`,
			{
				method: 'POST',
				body: formData,
			},
		)

		if (fetchResponse.status !== 200) {
			throw new Error('Error cloudinaryFileDAM.delete')
		}
	}
}
