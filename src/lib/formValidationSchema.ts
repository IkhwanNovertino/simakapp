import { z } from "zod";

export const permissionSchema = z.object({
  id: z.coerce.number().optional(),
  action: z.string().min(1, { message: "pilih aksi yang diinginkan!" }),
  resource: z.string().min(1, { message: "pilih modul/domain yang diinginkan!" }),
  // name: z.string().min(1, { message: "Hak akses harus diisi!" }),
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

export const courseSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, {message: "kode mata kuliah harus diisi"}),
  name: z.string().min(1, {message: "nama mata kuliah harus diisi"}),
  sks: z.coerce.number().min(1, { message: "sks harus diisi" }),
  majorId: z.coerce.number().min(1, { message: "program studi harus diisi" })
})

export type CourseInputs = z.infer<typeof courseSchema>;

export const lecturerSchema = z.object({
  id: z.string().optional(),
  // information authentication
  username: z.string().email({ message: "email tidak valid" }).min(5, { message: "email harus diisi" }),
  password: z.string().min(5, { message: "password minimal 5 karakter" }),
  roleId: z.string().min(1, {message: "role harus diisi"}),
  // information data lecturer
  npk: z.string().min(1, { message: "NPK harus diisi" }),
  nidn: z.string().min(1, {message: "NIDN harus diisi"}),
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  frontTitle: z.string().optional(),
  backTitle: z.string().optional(),
  degree: z.enum(["S1", "S2", "S3"], { message: "Pendidikan terakhir harus diisi" }),
  year: z.coerce.number().min(4, {message: "tahun masuk harus diisi"}),
  address: z.string().optional(),
  gender: z.enum(["PRIA", "WANITA"], { message: "Gender harus diisi" }),
  religion: z.enum(["ISLAM", "PROTESTAN", "KATOLIK", "HINDU", "BUDHA", "KONGHUCU", "DLL"], {message: "agama harus diisi"}),
  majorId: z.coerce.number().min(1, { message: "Program studi harus diisi" }),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  photo: z.string().optional(),

})

export type LecturerInputs = z.infer<typeof lecturerSchema>;

export const operatorSchema = z.object({
  id: z.string().optional(),
  // information authentication
  username: z.string().email({ message: "email tidak valid" }).min(5, { message: "email harus diisi" }),
  password: z.string().min(5, { message: "password minimal 5 karakter" }),
  roleId: z.string().min(1, {message: "role harus diisi"}),
  // information data operation
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  department: z.string().optional(),
})

export type OperatorInputs = z.infer<typeof operatorSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  // information authentication
  username: z.string().email({ message: "email tidak valid" }).min(5, { message: "email harus diisi" }),
  password: z.string().min(5, { message: "password minimal 5 karakter" }),
  roleId: z.string().min(1, {message: "role harus diisi"}),
  // information data student
  nim: z.string().length(12, {message: "NIM harus diisi"}),
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  year: z.coerce.number().min(4, { message: "tahun terdaftar harus diisi" }),
  religion: z.enum(["ISLAM", "PROTESTAN", "KATOLIK", "HINDU", "BUDHA", "KONGHUCU", "DLL"], {message: "agama harus diisi"}),
  gender: z.enum(["PRIA", "WANITA"], { message: "Gender harus diisi" }),
  address: z.string().optional(),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  photo: z.string().optional(),
  majorId: z.coerce.number().min(1, { message: "Program studi harus diisi" }),
  lecturerId: z.string().min(1, { message: "Perwalian akademik harus diisi" }),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  guardianHp: z.string().optional(),
  statusRegister: z.string().min(1, {message: "status registrasi harus diisi"}),
  
})

export type StudentInputs = z.infer<typeof studentSchema>;