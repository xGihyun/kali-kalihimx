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
	skill: z.string(),
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
