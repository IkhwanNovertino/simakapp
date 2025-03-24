import { z } from "zod";

export const permissionSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Hak akses harus diisi!" }),
  description: z.string().optional(),
})

export type PermissionInputs = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Hak akses harus diisi!" }),
  description: z.string().optional(),
  rolePermission: z.array(z.coerce.number()).min(1, { message: "Hak akses harus dipilih!" }), //ids permission
})

export type RoleInputs = z.infer<typeof roleSchema>;

export const rolePermissionSchema = z.object({
  roleId: z.coerce.number(),
  roleName: z.string(),
  roleDescription: z.string().optional(),
  permission: z.coerce.number(), //ids permission
})

export type RolePermissionInputs = z.infer<typeof rolePermissionSchema>;