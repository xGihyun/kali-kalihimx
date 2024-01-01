// import { email, number, object, string } from 'valibot';
import z from 'zod';

// export const LoginSchema = object({
// 	email: string([email()]),
// 	password: string()
// });

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5)
});

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5),
	section: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	age: z.coerce.number(),
	contact_number: z.coerce.number(),
	sex: z.number()
});

// export const RegisterSchema = object({
// 	email: string([email()]),
// 	password: string(),
// 	section: string(),
// 	first_name: string(),
// 	last_name: string(),
// 	age: number(),
// 	contact_number: number(),
// 	sex: number()
// });

// export const ArnisMatchSchema = object({
// 	section: string(),
// 	skill: string(),
// 	footwork: string()
// });

export const arnisMatchSchema = z.object({
	section: z.string(),
	skill: z.string().optional(),
	footwork: z.string()
});

export type ArnisMatchSchema = typeof arnisMatchSchema;

export const UpdateScoreSchema = z.object({
	user_id: z.string(),
	score: z.number(),
	difference: z.number(),
	is_winner: z.boolean()
});

export const SubmitScoreSchema = z.object({
	user1_id: z.string(),
	user2_id: z.string(),
	user1_score: z.coerce.number(),
	user2_score: z.coerce.number(),
	match_set_id: z.string()
});

export const UpdateUserSchema = z.object({
	email: z.string().email().nullable(),
	section: z.string().nullable(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	age: z.coerce.number().nullable(),
	contact_number: z.coerce.number().nullable(),
	sex: z.string().nullable(),
	score: z.coerce.number().nullable(),
	role: z.string().nullable()
});

export const SectionSchema = z.object({
	name: z.string(),
	user_limit: z.coerce.number()
});

export const DeleteSectionsSchema = z.object({
	sections: z.string().array(),
	force: z.coerce.boolean()
});

export const ResetPasswordSchema = z.object({
	email: z.string().email()
});
