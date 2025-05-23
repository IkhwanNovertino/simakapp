import { start } from "repl";
import { z } from "zod";

export const permissionSchema = z.object({
  id: z.coerce.number().optional(),
  action: z.string().min(1, { message: "pilih aksi yang diinginkan!" }),
  resource: z.string().min(1, { message: "pilih modul/domain yang diinginkan!" }),
  description: z.string().optional(),
})

export type PermissionInputs = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Hak akses harus diisi!" }),
  description: z.string().optional(),
  roleType: z.enum(["OPERATOR", "LECTURER", "STUDENT", "ADVISOR"], {message: "tipe role harus dipilih"}),
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
  predecessorId: z.string().optional(),
  isPKL: z.boolean().default(false),
  isSkripsi: z.boolean().default(false),
  courseType: z.string().min(1, {message: "tipe mata kuliah"}),
  majorId: z.coerce.number().min(1, { message: "program studi harus diisi" })
})

export type CourseInputs = z.infer<typeof courseSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().email({ message: "email tidak valid" }).min(5, { message: "email harus diisi" }).trim(),
  password: z.string().min(5, { message: "password minimal 5 karakter" }),
  roleId: z.string().min(1, { message: "role pengguna harus diisi" }),
  isStatus: z.boolean().default(false)
})

export type UserInputs = z.infer<typeof userSchema>;

export const lecturerSchema = z.object({
  id: z.string().optional(),
  npk: z.string().min(1, { message: "NPK harus diisi" }),
  nidn: z.string().min(1, {message: "NIDN harus diisi"}),
  nuptk: z.string().length(16, {message: "NUPTK harus 16 digit"}).optional().or(z.literal("")),
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  frontTitle: z.string().optional(),
  backTitle: z.string().optional(),
  degree: z.enum(["S1", "S2", "S3"], { message: "Pendidikan terakhir harus diisi" }),
  year: z.coerce.number().min(4, {message: "tahun masuk harus diisi"}),
  address: z.string().optional(),
  gender: z.enum(["PRIA", "WANITA"], { message: "Gender harus diisi" }),
  religion: z.enum(["ISLAM", "KATOLIK", "PROTESTAN", "BUDDHA", "HINDU", "KONGHUCU", "DLL"], {message: "agama harus diisi"}),
  majorId: z.coerce.number().min(1, { message: "Program studi harus diisi" }),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  photo: z.string().optional().or(z.literal("")),
})

export type LecturerInputs = z.infer<typeof lecturerSchema>;

export const operatorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  department: z.string().optional(),
})

export type OperatorInputs = z.infer<typeof operatorSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  // information data student
  nim: z.string().length(12, {message: "NIM harus diisi"}),
  name: z.string().min(1, { message: "nama mahasiswa harus diisi" }),
  year: z.coerce.number().min(4, { message: "tahun terdaftar harus diisi" }),
  religion: z.enum(["ISLAM", "KATOLIK", "PROTESTAN", "BUDDHA", "HINDU", "KONGHUCU", "DLL"], {message: "agama harus diisi"}),
  gender: z.enum(["PRIA", "WANITA"], { message: "Gender harus diisi" }),
  address: z.string().optional(),
  domicile: z.string().optional(),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  majorId: z.coerce.number().min(1, { message: "Program studi harus diisi" }),
  lecturerId: z.string().min(1, { message: "Perwalian akademik harus diisi" }),
  studentStatus: z.enum(["NONAKTIF", "AKTIF", "CUTI", "DO", "MENGUNDURKAN_DIRI", "LULUS"], {message: "status mahasiswa harus diisi"}),
  statusRegister: z.string().min(1, {message: "status registrasi harus diisi"}),
  photo: z.string().optional().or(z.literal("")),
  guardianName: z.string().optional(),
  guardianNIK: z.string().optional(),
  guardianJob: z.string().optional(),
  guardianHp: z.string().optional(),
  guardianAddress: z.string().optional(),
  motherName: z.string().optional(),
  motherNIK: z.string().optional(),

  placeOfBirth: z.string().optional(),
  birthday: z.string().optional(),
  
})

export type StudentInputs = z.infer<typeof studentSchema>;

export const loginSchema = z.object({
  username: z.string().email({ message: "email tidak valid" }).min(1, { message: "email harus diisi" }),
  password: z.string().min(1, { message: "password harus diisi" }),
})

export type LoginInputs = z.infer<typeof loginSchema>;

export const periodSchema = z.object({
  id: z.string().optional(),
  year: z.string().min(1, { message: "tahun akademik harus diisi" }),
  semesterType: z.enum(["GANJIL", "GENAP"], { message: "tipe semester harus diisi" }),
})

export type PeriodInputs = z.infer<typeof periodSchema>;

export const reregistrationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama herregistrasi harus diisi" }),
  periodId: z.string().min(1, { message: "periode akademik harus diisi" }),
  isReregisterActive: z.boolean().default(false),
})

export type ReregistrationInputs = z.infer<typeof reregistrationSchema>;

export const reregistrationCreateAllSchema = z.object({
  id: z.string().optional(),
})

export type ReregistrationCreateAllInputs = z.infer<typeof reregistrationCreateAllSchema>;

export const reregistrationDetailSchema = z.object({
  reregisterId: z.string().min(1, {message: "id Herregister harus diisi"}),
  studentId: z.string().min(1, {message: "pilih mahasiswa"}),
  semester: z.string().min(1, {message: "semester harus diisi"}),
  year: z.coerce.number().min(4, {message: "Tahun masuk/angkatan harus diisi"}),
  major: z.string().min(1, {message: "Pilih program studi"}),
  lecturerId: z.string().min(1, {message: "Pilih perwalian akademik"}),
  campusType: z.string().default("BJB"),
  nominal: z.coerce.number().optional(),
  paymentReceiptFile: z.string().optional().or(z.literal("")),
  paymentStatus: z.string().default("BELUM_LUNAS"),
  semesterStatus: z.string().default("NONAKTIF"),
  paymentDescription: z.string().optional(),
  placeOfBirth: z.string().optional(),
  birthday: z.string().optional(),
  domicile: z.string().optional(),
  address: z.string().optional(),
  hp: z.string().optional(),
  email: z.string().optional(),
  guardianName: z.string().optional(),
  guardianNIK: z.string().optional(),
  guardianJob: z.string().optional(),
  guardianHp: z.string().optional(),
  guardianAddress: z.string().optional(),
  motherName: z.string().optional(),
  motherNIK: z.string().optional(),
})

export type ReregistrationDetailInputs = z.infer<typeof reregistrationDetailSchema>;

export const reregistrationStudentSchema = z.object({
  reregisterId: z.string().min(1, {message: "id Herregister harus diisi"}),
  studentId: z.string().min(1, { message: "pilih mahasiswa" }),
  nim: z.string().optional(),
  name: z.string().optional(),
  semester: z.string().optional(),
  year: z.string().min(4, {message: "Tahun masuk/angkatan harus diisi"}),
  major: z.string().min(1, {message: "Pilih program studi"}),
  lecturerId: z.string().min(1, {message: "Pilih perwalian akademik"}),
  campusType: z.string().default("BJB"),
  placeOfBirth: z.string().min(1, {message: "Tempat lahir harus diisi"}),
  birthday: z.string().min(1, {message: "Tanggal lahir harus diisi"}),
  domicile: z.string().min(1, {message: "Alamat asal/domisili harus diisi"}),
  address: z.string().min(1, {message: "Alamat sekarang harus diisi"}),
  hp: z.string().min(1, {message: "No. Telp/HP harus diisi"}),
  email: z.string().min(1, {message: "email harus diisi"}),
  guardianName: z.string().min(1, {message: "nama orang tua/wali harus diisi"}),
  guardianNIK: z.string().min(1, {message: "NIK orang tua/wali harus diisi"}),
  guardianJob: z.string().min(1, {message: "pekerjaan orang tua/wali harus diisi"}),
  guardianHp: z.string().min(1, {message: "No. Telp/HP orang tua/wali harus diisi"}),
  guardianAddress: z.string().min(1, {message: "alamat orang tua/wali harus diisi"}),
  motherName: z.string().min(1, {message: "nama gadis ibu kandung harus diisi"}),
  motherNIK: z.string().min(1, {message: "NIK ibu kandung harus diisi"}),
})

export type ReregistrationStudentInputs = z.infer<typeof reregistrationStudentSchema>;

export const curriculumSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama kurikulum harus diisi" }),
  majorId: z.coerce.number().min(1, { message: "program studi harus diisi" }),
  startDate: z.string().min(1, { message: "tanggal mulai harus diisi" }),
  endDate: z.string().min(1, { message: "tanggal selesai harus diisi" }),
  isActive: z.boolean().default(false),
})

export type CurriculumInputs = z.infer<typeof curriculumSchema>;

export const curriculumDetailSchema = z.object({
  id: z.string().optional(),
  curriculumId: z.string().min(1, { message: "Id Kurikulum harus ada" }),
  courseId: z.array(z.string()).min(1, { message: "pilih mata kuliah" }),
  // courseId: z.string().min(1, { message: "pilih mata kuliah" }),
  semester: z.coerce.number().min(1, { message: "semester harus diisi" }),
})

export type CurriculumDetailInputs = z.infer<typeof curriculumDetailSchema>;