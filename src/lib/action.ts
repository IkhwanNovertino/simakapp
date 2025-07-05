"use server";

import path from "path";
import {
  AcademicClassDetailInputs,
  AssessmentInputs,
  ClassInputs,
  CourseInKrsInputs,
  CourseInputs, CurriculumDetailInputs, CurriculumInputs, GradeInputs, lecturerSchema, MajorInputs,
  OperatorInputs, PeriodInputs, PermissionInputs, PositionInputs, PresenceInputs, reregistrationDetailSchema,
  ReregistrationInputs, ReregistrationStudentInputs, RoleInputs,
  RoomInputs, ScheduleDetailInputs, ScheduleInputs, studentSchema, TimeInputs, UserInputs
} from "./formValidationSchema";
import { prisma } from "./prisma";
import { CampusType, Gender, PaymentStatus, Religion, SemesterStatus, StudyPlanStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { v4 } from "uuid";
import logger from "./logger";
import { handlePrismaError } from "./errors/prismaError";
import { AppError } from "./errors/appErrors";
import { calculatingSKSLimits } from "./utils";

type stateType = {
  success: boolean;
  error: boolean;
  message: string;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const avatarFilePath = process.env.AVATAR_FOLDER as string;
const paymentFilePath = process.env.PAYMENT_FOLDER as string;

export const createPermission = async (state: stateType, data: PermissionInputs) => {
  try {
    const name = data.action + ":" + data.resource;
    await prisma.permission.create({
      data: {
        name: name,
        description: data.description,
      }
    });
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updatePermission = async (state: stateType, data: PermissionInputs) => {
  try {
    await prisma.permission.update({
      where: {
        id: data.id
      },
      data: {
        name: `${data.action}:${data.resource}`,
        description: data.description,
      }
    });
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deletePermission = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.permission.delete({
      where: {
        id: parseInt(id)
      }
    });
  
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createRole = async (state: stateType, data: RoleInputs) => {
  try {
    await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        roleType: data.roleType,
        rolePermission: {
          createMany: {
            data: [
              ...data?.rolePermission.map((id: number) => ({ permissionId: id })),
            ],
          } ,
        },
      },
    });
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteRole = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    
    await prisma.role.delete({
      where: {
        id: parseInt(id)
      }
    });
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createRolePermissions = async (id: string) => {
  try {
    await prisma.rolePermission.create({
      data: {
        roleId: parseInt(id.split(":")[0]),
        permissionId: parseInt( id.split(":")[1]),
      }
    })

    return { success: true, error: false, message: "Hak akses telah diaktifkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteRolePermissions = async (id: string) => {
  try {
    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: parseInt(id.split(":")[0]),
          permissionId: parseInt( id.split(":")[1]),
        }
      }
    })
    return { success: true, error: false, messsage: "Hak akses telah dinonaktifkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const getRolePermission = async (id: string) => {
  try {
    const get = await prisma.rolePermission.findFirst({
      where: {
        roleId: parseInt(id.split(":")[0]),
        permissionId: parseInt( id.split(":")[1]),
      }
    })
    return {success: (get ? true : false), error: false};
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createMajor = async (state: stateType, data: MajorInputs) => {
  try {
    await prisma.major.create({
      data: {
        name: data.name,
        numberCode: data.numberCode,
        stringCode: data.stringCode,
      }
    });
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateMajor = async (state: stateType, data: MajorInputs) => {
  try {
    await prisma.major.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        numberCode: data.numberCode,
        stringCode: data.stringCode,
      }
    });
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteMajor = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.major.delete({
      where: {
        id: parseInt(id)
      }
    });
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createRoom = async (state: stateType, data: RoomInputs) => {
  try {
    await prisma.room.create({
      data: {
        name: data.name,
        location: data.location,
        capacity: data.capacity,
      }
    });
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateRoom = async (state: stateType, data: RoomInputs) => {
  try {
    await prisma.room.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        location: data.location,
        capacity: data.capacity,
      }
    });
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteRoom = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.room.delete({
      where: {
        id: parseInt(id)
      }
    });
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createCourse = async (state: stateType, data: CourseInputs) => {
  try {
    let dataPayload;
    if (data?.predecessorId === "") {
      dataPayload = {
        name: data.name,
        sks: data.sks,
        code: data.code,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
        courseType: data?.courseType || null,
        assessment: {
          connect: {
            id: data?.assessmentId,
          }
        },
        major: {
          connect: {
            id: data?.majorId
          },
        }
      }
    } else {
      dataPayload = {
        name: data.name,
        sks: data.sks,
        code: data.code,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
        courseType: data?.courseType || null,
        assessment: {
          connect: {
            id: data?.assessmentId,
          }
        },
        predecessor: {
          connect: {
            id: data?.predecessorId,
          },
        },
        major: {
          connect: {
            id: data?.majorId
          },
        }
      }
    }
    
    await prisma.course.create({
      data: dataPayload,
    });
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateCourse = async (state: stateType, data: CourseInputs) => {
  try {
    let dataPayload;
    if (data?.predecessorId === "") {
      dataPayload = {
        name: data.name,
        sks: data.sks,
        code: data.code,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
        courseType: data?.courseType || null,
        assessment: {
          connect: {
            id: data?.assessmentId,
          }
        },
        major: {
          connect: {
            id: data?.majorId
          },
        }
      }
    } else {
      dataPayload = {
        name: data.name,
        sks: data.sks,
        code: data.code,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
        courseType: data?.courseType || null,
        assessment: {
          connect: {
            id: data?.assessmentId,
          }
        },
        predecessor: {
          connect: {
            id: data?.predecessorId,
          },
        },
        major: {
          connect: {
            id: data?.majorId
          },
        }
      }
    };

    await prisma.course.update({
      where: {
        id: data.id
      },
      data: dataPayload
    });
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteCourse = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;

    await prisma.$transaction([
      prisma.course.update({
        where: {
          id: id
        },
        data: {
          predecessor: {
            disconnect: true
          },
          successor: {
            disconnect: true
          }
        }
      }),
      prisma.course.delete({
        where: {
          id: id,
        }
      })
    ])
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createUserLecturer = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
        lecturer: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateUserLecturer = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: data.roleId,
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const createUserStudent = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
        student: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return { success: true, error: false, message: "Data berhasil ditambah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const updateUserStudent = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: data.roleId,
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const createUserOperator = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
        operator: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateUserOperator = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: data.roleId,
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: data.roleId,
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createLecturer = async (state: stateType, data: FormData) => {
  try {
    const dataLecturerRaw = {
      npk: data.get('npk')?.toString(),
      nidn: data.get('nidn')?.toString(),
      nuptk: data.get('nuptk')?.toString(),
      name: data.get('name')?.toString(),
      frontTitle: data.get('frontTitle')?.toString(),
      backTitle: data.get('backTitle')?.toString(),
      degree: data.get('degree')?.toString(),
      year: parseInt(data.get('year') as string),
      address: data.get('address')?.toString(),
      majorId: parseInt(data.get('majorId') as string),
      gender: data.get('gender')?.toString(),
      hp: data.get('phone')?.toString(),
      email: data.get('email')?.toString(),
      religion: data.get('religion')?.toString(),
    }
    const photo = data.get('photo') as File;
    let fileUrl: string | undefined = undefined;
    if (photo && photo.size > 0) {

      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type);
      if (!photoType) throw new Error("Tipe file tidak sesuai");

      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`;
      const dirPath = path.join(process.cwd(), avatarFilePath);
      const filePath = path.join(dirPath, fileName);
      fileUrl = `${fileName}`;
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer);
    }

    const validation = lecturerSchema.safeParse({
      ...dataLecturerRaw,
      photo: fileUrl ?? '', // boleh string kosong
    })

    if (!validation.success) {
      return { success: false, error: true, message: "Data tidak berhasil ditambahkan" };
    }

    await prisma.lecturer.create({
      data: {
        npk: validation.data.npk,
        nidn: validation.data.nidn,
        nuptk: validation.data.nuptk,
        name: validation.data.name,
        frontTitle: validation.data.frontTitle,
        backTitle: validation.data.backTitle,
        degree: validation.data.degree,
        year: validation.data.year,
        address: validation.data.address,
        majorId: validation.data.majorId,
        gender: validation.data.gender,
        hp: validation.data.phone,
        email: validation.data.email,
        religion: validation.data.religion as Religion,
        photo: fileUrl ?? '',
      }
    })
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateLecturer = async (state: stateType, data: FormData) => {
  try {
    const dataLecturerRaw = {
      id: data.get('id')?.toString(),
      npk: data.get('npk')?.toString(),
      nidn: data.get('nidn')?.toString(),
      nuptk: data.get('nuptk')?.toString(),
      name: data.get('name')?.toString(),
      frontTitle: data.get('frontTitle')?.toString(),
      backTitle: data.get('backTitle')?.toString(),
      degree: data.get('degree')?.toString(),
      year: parseInt(data.get('year') as string),
      address: data.get('address')?.toString(),
      majorId: parseInt(data.get('majorId') as string),
      gender: data.get('gender')?.toString(),
      hp: data.get('phone')?.toString(),
      email: data.get('email')?.toString(),
      religion: data.get('religion')?.toString(),
    }
    const photo = data.get('photo') as File;
    const oldPhoto = data.get('oldFoto') as string;

    const parsed = lecturerSchema.omit({ photo: true }).safeParse(dataLecturerRaw);
    if (!parsed.success) {
      return { success: false, error: true, message: "Data tidak berhasil ditambahkan" }
    }

    let fileUrl = oldPhoto;
    if (photo && photo.size > 0) {
      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type);
      if (!photoType) throw new Error("Tipe file tidak sesuai");
      
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const dirPath = path.join(process.cwd(), avatarFilePath)
      const filePath = path.join(dirPath, fileName)
      fileUrl = `${fileName}`
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer)

      if (oldPhoto) {
        const oldPath = path.join(process.cwd(), avatarFilePath, oldPhoto);
        try {
          await unlink(oldPath)
        } catch (err: any) {
          logger.warn(err)
        }
      }
    }

    await prisma.lecturer.update({
      where: {
        id: parsed?.data.id,
      },
      data: {
        npk: parsed.data.npk,
        nidn: parsed.data.nidn,
        nuptk: parsed.data.nuptk,
        name: parsed.data.name,
        frontTitle: parsed.data.frontTitle,
        backTitle: parsed.data.backTitle,
        degree: parsed.data.degree,
        year: parsed.data.year,
        address: parsed.data.address,
        majorId: parsed.data.majorId,
        gender: parsed.data.gender,
        hp: parsed.data.phone,
        email: parsed.data.email,
        religion: parsed.data.religion as Religion,
        photo: fileUrl,
      }
    })
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteLecturer = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const dataDelete = await prisma.$transaction(async (tx: any) => {
      const data = await tx.lecturer.delete({
        where: {
          id: id.split(":")[0]
        },
      });

      if (id.split(":")[1] !== "null") {
        await tx.user.delete({
          where: {
            id: id.split(":")[1]
          }
        })
      }

      return data
    });

    if (dataDelete?.photo) {
      const filePath = path.join(process.cwd(), avatarFilePath, dataDelete.photo);
      try {
        await unlink(filePath)
      } catch (err: any) {
        logger.warn(err)
      }
    }
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createStudent = async (state: {success: boolean, error: boolean}, data: FormData) => {
  try {
    const id=data.get('id')?.toString()
    const name = data.get('name')?.toString();
    const nim = data.get('nim')?.toString();
    const majorId = parseInt(data.get('majorId') as string);
    const statusRegister = data.get('statusRegister')?.toString();
    const studentStatus = data.get('studentStatus')?.toString();
    const lecturerId = data.get('lecturerId')?.toString();
    const year = parseInt(data.get('year') as string);
    const placeOfBirth = data.get('placeOfBirth');
    const birthday = data.get('birthday');
    const photo = data.get('photo') as File;
    const religion = data.get('religion')?.toString() as Religion;
    const gender = data.get('gender')?.toString() as Gender;
    const email = data.get('email')?.toString();
    const phone = data.get('phone')?.toString();
    const domicile = data.get('domicile')?.toString();
    const address = data.get('address')?.toString();
    const guardianName = data.get('guardianName')?.toString();
    const guardianNIK = data.get('guardianNIK')?.toString();
    const guardianJob = data.get('guardianJob')?.toString();
    const guardianHp = data.get('guardianHp')?.toString();
    const guardianAddress = data.get('guardianAddress')?.toString();
    const motherName = data.get('motherName')?.toString();
    const motherNIK = data.get('motherNIK')?.toString();

    let fileUrl: string | undefined = undefined;
    if (photo && photo.size > 0) {
      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type)

      if (!photoType) throw new AppError("Tipe file tidak sesuai");
      
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const dirPath = path.join(process.cwd(), avatarFilePath)
      const filePath = path.join(dirPath, fileName)
      fileUrl = `${fileName}`
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer)
    }

    const validation = studentSchema.safeParse({
      id,
      name,
      nim,
      lecturerId,
      majorId,
      statusRegister,
      studentStatus,
      year,
      placeOfBirth,
      birthday,
      religion,
      gender,
      email,
      phone,
      address,
      domicile,
      guardianName,
      guardianNIK,
      guardianJob,
      guardianHp,
      guardianAddress,
      motherName,
      motherNIK,
      photo: fileUrl ?? '', // boleh string kosong
    })

    if (!validation.success) {
      throw new AppError("Data gagal ditambahkan", 400)
    }

    await prisma.student.create({
      data: {
        name: validation.data?.name,
        nim: validation.data?.nim,
        majorId: validation.data?.majorId,
        lecturerId : validation.data?.lecturerId,
        statusRegister : validation.data?.statusRegister,
        studentStatus : validation.data?.studentStatus,
        year: validation.data?.year,
        placeOfBirth: validation.data?.placeOfBirth,
        birthday:  new Date(validation.data?.birthday || Date.now()),
        religion : validation.data?.religion as Religion,
        email : validation.data?.email,
        hp : validation.data?.phone,
        gender : validation.data?.gender,
        address : validation.data?.address,
        domicile : validation.data?.domicile,
        guardianName : validation.data?.guardianName,
        guardianNIK : validation.data?.guardianNIK,
        guardianJob : validation.data?.guardianJob,
        guardianHp : validation.data?.guardianHp,
        guardianAddress : validation.data?.guardianAddress,
        motherName : validation.data?.motherName,
        motherNIK : validation.data?.motherNIK,
        photo: fileUrl ?? '', // boleh string kosong  
      },
    })
    return { success: true, error: false,  message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateStudent = async (state: {success: boolean, error: boolean}, data: FormData) => {
  try {

    const dataRaw = {
      id:data.get('id')?.toString(),
      name : data.get('name')?.toString(),
      nim : data.get('nim')?.toString(),
      lecturerId : data.get('lecturerId')?.toString(),
      majorId : parseInt(data.get('majorId') as string),
      statusRegister : data.get('statusRegister')?.toString(),
      studentStatus : data.get('studentStatus')?.toString(),
      year: parseInt(data.get('year') as string),
      placeOfBirth: data.get('placeOfBirth'),
      birthday: data.get('birthday'),
      religion : data.get('religion')?.toString() as Religion,
      gender : data.get('gender')?.toString() as Gender,
      email : data.get('email')?.toString(),
      phone : data.get('phone')?.toString(),
      address : data.get('address')?.toString(),
      domicile : data.get('domicile')?.toString(),
      guardianName : data.get('guardianName')?.toString(),
      guardianNIK : data.get('guardianNIK')?.toString(),
      guardianJob : data.get('guardianJob')?.toString(),
      guardianHp : data.get('guardianHp')?.toString(),
      guardianAddress : data.get('guardianAddress')?.toString(),
      motherName : data.get('motherName')?.toString(),
      motherNIK : data.get('motherNIK')?.toString(),
    }

    const photo = data.get('photo') as File;
    const oldPhoto = data.get('oldFoto') as string;

    const parsed = studentSchema.omit({ photo: true }).safeParse(dataRaw);

    if (!parsed.success) {
      throw new AppError("Data tidak berhasil diubah", 400);
      
    }

    let fileUrl = oldPhoto;
    if (photo && photo.size > 0) {
      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type);
      if (!photoType) throw new AppError("Tipe file tidak sesuai", 400);

      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const dirPath = path.join(process.cwd(), avatarFilePath)
      const filePath = path.join(dirPath, fileName)
      fileUrl = `${fileName}`
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer)

      if (oldPhoto) {
        const oldPath = path.join(process.cwd(), avatarFilePath, oldPhoto);
        try {
          await unlink(oldPath)
        } catch (err: any) {
          logger.warn(err)
        }
      }
    }

    await prisma.student.update({
      where: {
        id: parsed.data?.id
      },
      data: {
        name: parsed.data?.name,
        nim: parsed.data?.nim,
        majorId: parsed.data?.majorId,
        lecturerId : parsed.data?.lecturerId,
        statusRegister : parsed.data?.statusRegister,
        studentStatus : parsed.data?.studentStatus,
        year: parsed.data?.year,
        placeOfBirth: parsed.data?.placeOfBirth,
        birthday: new Date(parsed.data?.birthday || Date.now()),
        religion : parsed.data?.religion as Religion,
        gender : parsed.data?.gender,
        email : parsed.data?.email,
        hp : parsed.data?.phone,
        domicile : parsed.data?.domicile,
        address : parsed.data?.address,
        guardianName : parsed.data?.guardianName,
        guardianNIK : parsed.data?.guardianNIK,
        guardianJob : parsed.data?.guardianJob,
        guardianHp : parsed.data?.guardianHp,
        guardianAddress : parsed.data?.guardianAddress,
        motherName : parsed.data?.motherName,
        motherNIK : parsed.data?.motherNIK,
        photo: fileUrl,
      }
    })

    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteStudent = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const dataDelete = await prisma.$transaction(async (tx: any) => {
      const data = await tx.student.delete({
        where: {
          id: id.split(":")[0]
        },
      });

      if (id.split(":")[1] !== "null") {
        await tx.user.delete({
          where: {
            id: id.split(":")[1]
          }
        })
      }

      return data
    });

    if (dataDelete?.photo) {
      const filePath = path.join(process.cwd(), avatarFilePath, dataDelete.photo);
      try {
        await unlink(filePath)
      } catch (err: any) {
        logger.warn(err)
      }
    }
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createOperator = async (state: stateType, data: OperatorInputs) => {
  try {
    await prisma.operator.create({
      data: {
        name: data.name,
        department: data?.department,
      }
  })
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateOperator = async (state: stateType, data: OperatorInputs) => {
  try {
    await prisma.operator.update({
      where: {
        id: data?.id
      },
      data: {
        name: data.name,
        department: data?.department,
      }
    })
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteOperator = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;

    await prisma.$transaction(async (tx: any) => {
      await tx.operator.delete({
        where: {
          id: id.split(":")[0]
        },
      });

      if (id.split(":")[1] !== "null") {
        await tx.user.delete({
          where: {
            id: id.split(":")[1]
          }
        })
      }
    });
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createPeriod = async (state: stateType, data: PeriodInputs) => {
  try {
    if (data?.isActive) {
      await prisma.period.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        }
      })
    }
    const yearData = data.semesterType === "GANJIL" ? data.year.split("/")[0] : data.year.split("/")[1]
    await prisma.period.create({
      data: {
        semesterType: data.semesterType,
        year: parseInt(yearData),
        name: `${data.semesterType} ${data.year}`,
        isActive: data.isActive,
        reregister: {
          create: {
            name: `herregistrasi ${data.semesterType} ${data.year}`,
          }
        }
      }
    })
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updatePeriod = async (state: stateType, data: PeriodInputs) => {
  try {
    if (data?.isActive) {
      await prisma.period.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        }
      })
    }
    const yearData = data.semesterType === "GANJIL" ? data.year.split("/")[0] : data.year.split("/")[1]
    await prisma.period.update({
      where: {
        id: data.id
      },
      data: {
        semesterType: data.semesterType,
        year: parseInt(yearData),
        name: `${data.semesterType} ${data.year}`,
        isActive: data.isActive,
      }
    })
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deletePeriod = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.period.delete({
      where: {
        id: id
      }
    })
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createReregistration = async (state: stateType, data: ReregistrationInputs) => {
  try {
    logger.info(data)
    await prisma.reregister.create({
      data: {
        periodId: data.periodId,
        name: data.name,
        isReregisterActive: data.isReregisterActive,
      }
    })
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateReregistration = async (state: stateType, data: ReregistrationInputs) => {
  try {
    logger.info(data)
    await prisma.reregister.update({
      where: {
        id: data.id
      },
      data: {
        periodId: data.periodId,
        name: data.name,
        isReregisterActive: data.isReregisterActive,
      }
    })
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteReregistration = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.reregister.delete({
      where: {
        id: id
      }
    })
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const reregisterCreateAll = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    logger.info(id);
    
    // const reregisterDetailCount = await prisma.reregisterDetail.count({});
    const currentReregister = await prisma.reregister.findUnique({
      where: {
        id: id,
      },
      include: {
        period: true,
      },
    });
    const currentReregisterYear = currentReregister?.period?.year;
    const currentReregisterSemesterType = currentReregister?.period?.semesterType === "GANJIL" ? 1 : 0;
    
    const students = await prisma.student.findMany({
      where: {
        studentStatus: {
          in: ['NONAKTIF', 'AKTIF', 'CUTI'],
        }
      },
      include: {
        reregisterDetail: true,
      }
    });
    
    const dataReregisterDetails = students.map((student: any) => ({
      reregisterId: id,
      studentId: student.id,
      semester: (currentReregisterYear - student.year) * 2 + currentReregisterSemesterType,
      lecturerId: student.lecturerId,
    }));

    const insertDataStudents = dataReregisterDetails.filter((student: any) => student.semester > 0)
    await prisma.reregisterDetail.createMany({
      data: insertDataStudents,
    });
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

// Apakah studentStatus di student model akan mengikuti semesterStatus di reregisterDetail model
export const createReregisterDetail = async (state: stateType, data: FormData) => {
  try {
    const dataRaw = {
      reregisterId: data.get("reregisterId")?.toString(),
      studentId: data.get("studentId")?.toString(),
      lecturerId: data.get("lecturerId")?.toString(),
      semesterStatus: data.get("semesterStatus")?.toString(),
      paymentStatus: data.get("paymentStatus")?.toString(),
      paymentDescription: data.get("paymentDescription")?.toString(),
      campusType: data.get("campusType")?.toString(),
      nominal: parseInt(data.get("nominal") as string) || 0,
      year: data.get("year"),
      semester: data.get("semester")?.toString(),
      major: data.get("major")?.toString(),
    }
    const paymentReceiptFile = data.get("paymentReceiptFile") as File;

    if (parseInt(dataRaw.semester as string) < 1)
      throw new AppError("Data tidak bisa ditambahkan", 400);

    let fileUrl: string | undefined = undefined;
    if (paymentReceiptFile && paymentReceiptFile.size > 0) {
      const fileTypeCheck = ACCEPTED_IMAGE_TYPES.includes(paymentReceiptFile.type)

      if (!fileTypeCheck)
        throw new AppError("Tipe file tidak sesuai", 400);

      const bytes = await paymentReceiptFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${v4()}-${paymentReceiptFile.name}`
      const dirPath = path.join(process.cwd(), paymentFilePath)
      const filePath = path.join(dirPath, fileName)
      fileUrl = `${fileName}`
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer)
    }
    const validation = reregistrationDetailSchema.safeParse({
      ...dataRaw,
      paymentReceiptFile: fileUrl ?? '',
    });

    if (!validation.success) {
      return { success: false, error: true, message: "Data gagal ditambahkan" }
    };

    let ipkNum = Number(parseFloat("3.25").toFixed(2));
    let maxSKS = await calculatingSKSLimits(ipkNum);
    //perlu diedit dibagian updateReregisterDetail #010101
    prisma.$transaction(async (tx: any) => {
      const dataReregister =  await tx.reregisterDetail.create({
        data: {
          reregisterId: validation.data.reregisterId,
          studentId: validation.data.studentId,
          lecturerId: validation.data.lecturerId,
          campusType: validation.data?.campusType || "BJB" as CampusType,
          semesterStatus: validation.data?.semesterStatus || "NONAKTIF" as SemesterStatus,
          semester: parseInt(validation.data?.semester),
          nominal: validation.data.nominal,
          paymentStatus: validation.data?.paymentStatus || "BELUM_LUNAS" as PaymentStatus,
          paymentReceiptFile: validation.data?.paymentReceiptFile,
          paymentDescription: validation.data?.paymentDescription,
        },
      });
      if (dataReregister.semesterStatus === "AKTIF") {
        await tx.student.update({
          where: {
            id: validation.data.studentId,
          },
          data: {
            studentStatus: validation?.data?.semesterStatus,
          }
        });

        if (dataReregister.semester === 1) {
          ipkNum = 0;
          maxSKS = "21-22"
        }

        await tx.krs.create({
          data: {
            reregisterId: validation?.data?.reregisterId,
            studentId: validation?.data?.studentId,
            ipk: ipkNum,
            maxSks: maxSKS,
            lecturerId: validation.data.lecturerId,
          }
        });
      }
    });
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const updateReregisterDetail = async (state: stateType, data: FormData) => {
  try {
    const dataRaw = {
      reregisterId: data.get("reregisterId")?.toString(),
      studentId: data.get("studentId")?.toString(),
      lecturerId: data.get("lecturerId")?.toString(),
      semesterStatus: data.get("semesterStatus")?.toString(),
      paymentStatus: data.get("paymentStatus")?.toString(),
      paymentDescription: data.get("paymentDescription")?.toString(),
      campusType: data.get("campusType")?.toString(),
      nominal: parseInt(data.get("nominal") as string) || 0,
      year: data.get("year"),
      semester: data.get("semester")?.toString(),
      major: data.get("major")?.toString(),
    }
    const paymentReceiptFile = data.get("paymentReceiptFile") as File;

    const oldPaymentFile = await prisma.reregisterDetail.findFirst({
      where: {
          reregisterId: dataRaw?.reregisterId,
          studentId: dataRaw?.studentId,
      },
    });

    let fileUrl: string | undefined = undefined;
    if (paymentReceiptFile && paymentReceiptFile.size > 0) {
      const fileTypeCheck = ACCEPTED_IMAGE_TYPES.includes(paymentReceiptFile.type)
      if (!fileTypeCheck) throw new Error("Tipe file tidak sesuai");

      const bytes = await paymentReceiptFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${v4()}-${paymentReceiptFile.name}`
      const dirPath = path.join(process.cwd(), paymentFilePath)
      const filePath = path.join(dirPath, fileName)
      fileUrl = `${fileName}`
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, buffer)

      if (oldPaymentFile.paymentReceiptFile) {
        const oldPath = path.join(process.cwd(), paymentFilePath, oldPaymentFile.paymentReceiptFile);
        try {
          await unlink(oldPath)
        } catch (err: any) {
          logger.warn(err)
        }
      }
    }
    const validation = reregistrationDetailSchema.safeParse({
      ...dataRaw,
      paymentReceiptFile: fileUrl ?? '',
    });
    
    
    if (!validation.success) {
      return { success: false, error: true, message: "Data gagal ditambahkan" }
    };

    if (validation.data?.semesterStatus === "AKTIF") {
      // jika ada data khs, maka ipk diambil dari studentId di KHS 
      const ipkNum = Number(parseFloat("3.25").toFixed(2));
      const maxSKS = await calculatingSKSLimits(ipkNum);
      await prisma.krs.create({
        data: {
          reregisterId: validation?.data?.reregisterId,
          studentId: validation?.data?.studentId,
          ipk: ipkNum,
          maxSks: maxSKS,
          lecturerId: validation.data.lecturerId,
        }
      })
    }

    await prisma.$transaction([
      prisma.student.update({
        where: {
          id: validation?.data.studentId
        },
        data: {
          studentStatus: validation?.data?.semesterStatus,
        }
      }),
      prisma.reregisterDetail.update({
        where: {
          reregisterId_studentId: {
            reregisterId: validation?.data.reregisterId,
            studentId: validation?.data.studentId,
          }
        },
        data: {
          lecturerId: validation?.data.lecturerId,
          campusType: validation?.data?.campusType || "BJB" as CampusType,
          semesterStatus: validation?.data?.semesterStatus as SemesterStatus,
          semester: parseInt(validation?.data?.semester),
          nominal: validation?.data.nominal,
          paymentStatus: validation?.data?.paymentStatus as PaymentStatus,
          paymentReceiptFile: validation?.data?.paymentReceiptFile,
          paymentDescription: validation?.data?.paymentDescription,
        },
      })
    ])
    
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const deleteReregisterDetail = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;

    const deleteData = await prisma.reregisterDetail.delete({
      where: {
        reregisterId_studentId: {
          reregisterId: id.split(":")[0],
          studentId: id.split(":")[1]
        }
      },
      select: {
        paymentReceiptFile: true,
      },
    })
    if (deleteData.paymentReceiptFile) {
      const oldPath = path.join(process.cwd(), paymentFilePath, deleteData.paymentReceiptFile);
      try {
        await unlink(oldPath)
      } catch (err: any) {
        logger.warn(err)
      }
    }
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};

export const createReregisterStudent = async (state: stateType, data: ReregistrationStudentInputs) => {
  try {
    await prisma.$transaction([
      prisma.student.update({
        where: {
          id: data.studentId,
        },
        data: {
          placeOfBirth: data?.placeOfBirth,
          birthday: new Date(data?.birthday || Date.now()),
          domicile: data?.domicile,
          address: data?.address,
          hp: data?.hp,
          email: data?.email,
          guardianName: data?.guardianName,
          guardianNIK: data?.guardianNIK,
          guardianJob: data?.guardianJob,
          guardianHp: data?.guardianHp,
          guardianAddress: data?.guardianAddress,
          motherName: data?.motherName,
          motherNIK: data?.motherNIK,
        }
      }),
      prisma.reregisterDetail.update({
        where: {
          reregisterId_studentId: {
            reregisterId: data.reregisterId,
            studentId: data.studentId,
          },
        },
        data: {
          isStatusForm: true,
        }
      })
    ])
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};

export const createCurriculum = async (state: stateType, data: CurriculumInputs) => {
  try {
    // let dataCreate = {
    //   name: data?.name,
    //   majorId: data?.majorId,
    //   startDate: new Date(data?.startDate || Date.now()),
    //   endDate: new Date(data?.endDate || Date.now()),
    //   isActive: data?.isActive,
    // }
    if (data?.isActive) {
      await prisma.curriculum.updateMany({
        where: {
          majorId: data?.majorId,
        },
        data: {
          isActive: false,
        }
      })
    }
    await prisma.curriculum.create({
      data: {
        name: data?.name,
        majorId: data?.majorId,
        startDate: new Date(data?.startDate || Date.now()),
        endDate: new Date(data?.endDate || Date.now()),
        isActive: data?.isActive,
      }
    });
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const updateCurriculum = async (state: stateType, data: CurriculumInputs) => {
  try {

    if (data?.isActive) {
      await prisma.curriculum.updateMany({
        where: {
          majorId: data?.majorId,
        },
        data: {
          isActive: false,
        }
      })
    }

    await prisma.curriculum.update({
      where: {
        id: data?.id
      },
      data: {
        name: data?.name,
        majorId: data?.majorId,
        startDate: new Date(data?.startDate || Date.now()),
        endDate: new Date(data?.endDate || Date.now()),
        isActive: data?.isActive,
      }
    });
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const deleteCurriculum = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;

    await prisma.curriculum.delete({
      where: {
        id: id
      }
    });
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};

export const createCurriculumDetail = async (state: stateType, data: CurriculumDetailInputs) => {
  try {
    for (const itemCourse of data.courseId) {
      await prisma.curriculumDetail.create({
        data: {
          curriculumId: data?.curriculumId,
          courseId: itemCourse,
          semester: data?.semester,
        }
      });
    }
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};
export const deleteCurriculumDetail = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    
    await prisma.curriculumDetail.delete({
      where: {
        id: id
      }
    });

    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
};

export const createGrade = async (state: stateType, data: GradeInputs) => {
  try {
    await prisma.gradeComponent.create({
      data: {
        name: data.name,
      }
    })
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateGrade = async (state: stateType, data: GradeInputs) => {
  try {
    await prisma.gradeComponent.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
      }
    })
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteGrade = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.gradeComponent.delete({
      where: {
        id: id,
      }
    })
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createAssessment = async (state: stateType, data: AssessmentInputs) => {
  try {
    
    await prisma.assessment.create({
      data: {
        name: data.name,
        assessmentDetail: {
          create: data.gradeComponents.map((item) => ({
            percentage: item.percentage,
            grade: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateAssessment = async (state: stateType, data: AssessmentInputs) => {
  try {
    await prisma.$transaction(async (tx: any) => {
      // delete data assessmentDetail yang lama
      await tx.assessmentDetail.deleteMany({
        where: {
          assessmentId: data.id,
        }
      })

      // create data assessment baru diinput
      await tx.assessment.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          assessmentDetail: {
            create: data.gradeComponents.map((item) => ({
              percentage: item.percentage,
              grade: {
                connect: {
                  id: item.id,
                },
              },
            })),
          },
        }
      });
    });
    return { success: true, error: false, message: "Data berhasil diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteAssessment = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.$transaction([
      prisma.assessmentDetail.deleteMany({
        where: {
          assessmentId: id,
        }
      }),
      prisma.assessment.delete({
        where: {
          id: id,
        }
      }),
    ]);
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createKrsDetail = async (state: stateType, data: CourseInKrsInputs) => {
  try {
    const dataCreateKRS = data.course.map((item) => {
      return {
        krsId: data?.id,
        courseId: item.id,
        isAcc: false,
      }
    });
    await prisma.$transaction([
      prisma.krsDetail.createMany({
        data: dataCreateKRS,
      }),
      prisma.krs.update({
        where: {
          id: data?.id,
        },
        data: {
          isStatusForm: "SUBMITTED" as StudyPlanStatus,
        },
      })
    ])
    return { success: true, error: false, message: "Mata Kuliah berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateKrsDetail = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const isAcc = data.get("isAcc") as string === "false" ? false : true;
    
    prisma.$transaction(async (tx: any) => {
      const data = await tx.krsDetail.update({
        where: {
          id: id,
        },
        data: {
          isAcc: !isAcc
        }
      })

      const dataCheck = await tx.krsDetail.findMany({
        where: {
          krsId: data.krsId,
          isAcc: false,
        },
      });

      if (dataCheck.length > 0) {
        await tx.krs.update({
          where: {
            id: data.krsId,
          },
          data: {
            isStatusForm: "NEED_REVISION" as StudyPlanStatus,
          },
        });
      } else {
        await tx.krs.update({
          where: {
            id: data.krsId,
          },
          data: {
            isStatusForm: "APPROVED" as StudyPlanStatus,
          },
        })
      }
    })
    
    return { success: true, error: false, message: "Status mata kuliah telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteKrsDetail = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.krsDetail.delete({
      where: {
        id: id,
      }
    })
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createPosition = async (state: stateType, data: PositionInputs) => {
  try {
    await prisma.position.create({
      data: {
        positionName: data.positionName,
        personName: data.personName,
      },
    })
    
    return { success: true, error: false, message: "Jabatan berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updatePosition = async (state: stateType, data: PositionInputs) => {
  try {
    await prisma.position.update({
      where: {
        id: data.id,
      },
      data: {
        positionName: data.positionName,
        personName: data.personName,
      },
    })
    return { success: true, error: false, message: "Jabatan telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deletePosition = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.position.delete({
      where: {
        id: id,
      }
    })
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createClass = async (state: stateType, data: ClassInputs) => {
  try {
    await prisma.academicClass.create({
      data: {
        name: data.name,
        courseId: data.courseId,
        semester: data.semester,
        lecturerId: data.lecturerId,
        roomId: data.roomId,
        periodId: data.periodId,
      }
    });
    
    return { success: true, error: false, message: "Kelas berhasil ditambahkan" };
  } catch (err: any) {
    console.log(err);
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateClass = async (state: stateType, data: ClassInputs) => {
  try {
    await prisma.academicClass.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        courseId: data.courseId,
        semester: data.semester,
        lecturerId: data.lecturerId,
        roomId: data.roomId,
        periodId: data.periodId,
      }
    });
    return { success: true, error: false, message: "Kelas telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteClass = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.academicClass.delete({
      where: {
        id: id,
      }
    });

    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createTime = async (state: stateType, data: TimeInputs) => {
  try {

    await prisma.time.create({
      data: {
        timeStart: new Date(`2003-01-31T${data.timeStart}`),
        timeFinish: new Date(`2003-01-31T${data.timeFinish}`),
      }
    })
    
    return { success: true, error: false, message: "Waktu pelajaran berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateTime = async (state: stateType, data: TimeInputs) => {
  try {
    console.log("updateTime called", data);
    await prisma.time.update({
      where: {
        id: data?.id
      },
      data: {
        timeStart: new Date(`2003-01-31T${data.timeStart}`),
        timeFinish: new Date(`2003-01-31T${data.timeFinish}`),
      }
    })

    return { success: true, error: false, message: "Waktu pelajaran telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteTime = async (state: stateType, data: FormData) => {
  try {
    console.log("deleteTime called");
    const id = data.get("id") as string;
    await prisma.time.delete({
      where: {
        id: id,
      }
    });

    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createSchedule = async (state: stateType, data: ScheduleInputs) => {
  try {

    if (data.isActive) {
      await prisma.schedule.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        }
      });
    }

    await prisma.schedule.create({
      data: {
        name: data.name,
        periodId: data.periodId,
        isActive: data.isActive,
      },
    });
    
    return { success: true, error: false, message: "Jadwal berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateSchedule = async (state: stateType, data: ScheduleInputs) => {
  try {
    console.log("updateSchedule called", data);

    if (data.isActive) {
      await prisma.schedule.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        }
      });
    }

    await prisma.schedule.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        periodId: data.periodId,
        isActive: data.isActive,
      },
    });

    return { success: true, error: false, message: "Jadwal telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteSchedule = async (state: stateType, data: FormData) => {
  try {
    console.log("deleteSchedule called");
    const id = data.get("id") as string;
    await prisma.schedule.delete({
      where: {
        id: id,
      }
    });

    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createScheduleDetail = async (state: stateType, data: ScheduleDetailInputs) => {
  try {
    console.log("createScheduleDetail", data);

    await prisma.scheduleDetail.create({
      data: {
        scheduleId: data?.scheduleId,
        academicClassId: data?.academicClass,
        dayName: data?.dayName,
        timeId: data?.time,
        
      },
    });
    
    return { success: true, error: false, message: "Jadwal berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updateScheduleDetail = async (state: stateType, data: ScheduleDetailInputs) => {
  try {
    console.log("updateSchedule called", data);

    // if (data.isActive) {
    //   await prisma.schedule.updateMany({
    //     where: {
    //       isActive: true,
    //     },
    //     data: {
    //       isActive: false,
    //     }
    //   });
    // }

    // await prisma.schedule.update({
    //   where: {
    //     id: data.id,
    //   },
    //   data: {
    //     name: data.name,
    //     periodId: data.periodId,
    //     isActive: data.isActive,
    //   },
    // });

    return { success: true, error: false, message: "Jadwal telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteScheduleDetail = async (state: stateType, data: FormData) => {
  try {
    console.log("deleteSchedule called");
    const id = data.get("id") as string;
    await prisma.scheduleDetail.delete({
      where: {
        id: id,
      }
    });

    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createClassDetail = async (state: stateType, data: AcademicClassDetailInputs) => {
  try {
    console.log('CREATECLASSDETAIL', data);
    for (const student of data.students) {
      await prisma.academicClassDetail.create({
        data: {
          academicClassId: data.classId,
          studentId: student,
        },
      });
    };
    
    return { success: true, error: false, message: "Data berhasil ditambahkan" };
  } catch (err) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deleteClassDetail = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.academicClassDetail.delete({
      where: {
        id: id
      }
    })
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}

export const createPresence = async (state: stateType, data: PresenceInputs) => {
  try {
    console.log('CREATE PRESENCE', data);

    await prisma.presence.create({
      data: {
        academicClassId: data.academicClassId,
        weekNumber: data.weekNumber,
        date: new Date(data.date),
        duration: data.duration,
        lesson: data.lesson,
        lessonDetail: data.lessonDetail,
        learningMethod: data.learningMethod.join(","),
      },
    })
    
    return { success: true, error: false, message: "Jadwal berhasil ditambahkan" };
  } catch (err: any) {
    
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const updatePresence = async (state: stateType, data: PresenceInputs) => {
  try {
    console.log('UPDATE PRESENCE', data);

    await prisma.presence.update({
      where: {
        id: data?.id,
      },
      data: {
        academicClassId: data.academicClassId,
        weekNumber: data.weekNumber,
        date: new Date(data.date),
        duration: data.duration,
        lesson: data.lesson,
        lessonDetail: data.lessonDetail,
        learningMethod: data.learningMethod.join(","),
      },
    })
    
    return { success: true, error: false, message: "Jadwal telah diubah" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
export const deletePresence = async (state: stateType, data: FormData) => {
  try {
    console.log('DELETE PRESENCE', data);
    const id = data.get("id") as string;
    await prisma.presence.delete({
      where: {
        id: id,
      }
    })
    
    return { success: true, error: false, message: "Data berhasil dihapus" };
  } catch (err: any) {
    try {
      handlePrismaError(err)
    } catch (error: any) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}