import { z } from 'zod'

export const parseZodErrors = (error: z.ZodError) => {
	const errors = error.errors.reduce(
		(acc: Record<string, string[]>, { message, path }) => {
			const key = path.join('.')
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push(message)
			return acc
		},
		{},
	)

	return {
		errors,
	}
}
