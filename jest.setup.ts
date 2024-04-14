import { jest } from '@jest/globals'

function mockUUID(): `${string}-${string}-${string}-${string}-${string}` {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	}) as `${string}-${string}-${string}-${string}-${string}`
}

Object.defineProperty(globalThis, 'crypto', {
	value: {
		randomUUID: jest.fn(mockUUID),
	},
	writable: true,
	enumerable: true,
	configurable: true,
})
