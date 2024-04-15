import { FileStorage } from '../file-storage'

export class InMemoryFileStorage implements FileStorage {
	async upload() {
		return { url: crypto.randomUUID() }
	}

	async delete() {}
}
