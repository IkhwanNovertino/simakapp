import { z } from "zod";

export const permissionSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Hak akses harus diisi!" }),
  description: z.string().optional(),
})

export type PermissionInputs = z.infer<typeof permissionSchema>;