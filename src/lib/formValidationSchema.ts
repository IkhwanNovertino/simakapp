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

export const majorSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {message: "nama program studi harus diisi"}),
  numberCode: z.coerce.number().min(1, {message: "kode angka program studi harus diisi"}),
  stringCode: z.string().min(1, {message: "kode program studi harus diisi"}),
})

export type MajorInputs = z.infer<typeof majorSchema>;

export const roomSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {message: "ruang/lokal harus diisi"}),
  location: z.enum(["BJB", "BJM"], {message: "lokasi ruang/lokal harus diisi"}),
  capacity: z.coerce.number().min(1, {message: "kapasitas ruang/lokal harus diisi"}),
})

export type RoomInputs = z.infer<typeof roomSchema>;