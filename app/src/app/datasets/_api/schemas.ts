import { JsonStatSchema } from '@app-utils'
import { z } from 'zod'

export const EurostatDatasetSchema = z.object({
	label: z.string(),
	updated: z.string(),
	id: JsonStatSchema.shape.id,
	size: JsonStatSchema.shape.size,
	value: JsonStatSchema.shape.value,
	dimension: JsonStatSchema.shape.dimension,
})

export const BaseDatasetSchema = z.object({
	code: z
		.string()
		.min(1, 'Code cannot be empty')
		.regex(/^[a-zA-Z0-9_]+$/, 'Invalid code format'),
	title: z.string().min(1, 'Title cannot be empty'),
	source: z.literal('eurostat'),
})
