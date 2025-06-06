import { z } from "zod";
import { GetRoleDTO } from "./role.dto";

const uuidSchema = z.string().uuid()
const usernameSchema = z.string().min(1).max(255)
const emailSchema = z.string().email()
const passwordSchema = z.string().min(8).max(255)

export const insertUserSchema = z.object({
    uuid: uuidSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
})

export interface InsertUserDTO extends z.infer<typeof insertUserSchema> {}

export const editUserSchema = z.object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
})

export interface EditUserDTO extends z.infer<typeof editUserSchema> {}

export interface GetUserDTO{
    id: number,
    uuid: string,
    username: string,
    email: string,
}

export interface GetUserAggregateDTO extends GetUserDTO{
    roles: GetRoleDTO[]
}
