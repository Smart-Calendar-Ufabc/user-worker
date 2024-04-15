export interface FileStorage {
	upload({
		image,
		optionalParams,
		resourceType,
	}: {
		image: string
		optionalParams?: Array<{ name: string; value: string }>
		resourceType?: string
	}): Promise<{ url: string }>
	delete({
		publicId,
		resourceType,
	}: {
		publicId: string
		resourceType: string
	}): Promise<void>
}
