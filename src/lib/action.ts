"use server";

import path from "path";
import {
  CourseInputs, lecturerSchema, MajorInputs, OperatorInputs,
  PermissionInputs, RoleInputs, RoomInputs, studentSchema, UserInputs
} from "./formValidationSchema";
import { prisma } from "./prisma";
import { Gender, Religion } from "@prisma/client";
import bcrypt from "bcryptjs";
import { unlink, writeFile } from "fs/promises";
import { v4 } from "uuid";
import logger from "./logger";

type stateType = {
  success: boolean;
  error: boolean
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const createPermission = async (state: stateType, data: PermissionInputs) => {
  try {
    const name = data.action + ":" + data.resource;
    await prisma.permission.create({
      data: {
        name: name,
        description: data.description,
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const deletePermission = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: {
          permissionId: parseInt(id)
        }
      }),

      prisma.permission.delete({
        where: {
          id: parseInt(id)
        }
      }),
    ])
  
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const updateRole = async (state: stateType, data: RoleInputs) => {
  try {
    await prisma.role.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
      }
    })
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const deleteRole = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: {
          roleId: parseInt(id)
        }
      }),

      prisma.role.delete({
        where: {
          id: parseInt(id)
        }
      }),
    ])
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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

    return {success: true, error: false};
  } catch (err: any) {
    logger.error(err)
    return {success: false, error: true};
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
    return {success: true, error: false};
  } catch (err: any) {
    logger.error(err)
    return {success: false, error: true};
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
    logger.error(err)
    return {success: false, error: true};
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}

export const createCourse = async (state: stateType, data: CourseInputs) => {
  try {
    await prisma.course.create({
      data: {
        name: data.name,
        sks: data.sks,
        code: data.code,
        majorId: data.majorId,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const updateCourse = async (state: stateType, data: CourseInputs) => {
  try {
    await prisma.course.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        sks: data.sks,
        code: data.code,
        majorId: data.majorId,
        isPKL: data.isPKL,
        isSkripsi: data.isSkripsi,
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const deleteCourse = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    await prisma.course.delete({
      where: {
        id: id,
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}

export const createUserLecturer = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
        lecturer: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return {success: true, error:false}
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const updateUserLecturer = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return {success: true, error:false}
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const createUserStudent = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
        student: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return { success: true, error: false }
  } catch (err: any) {
    logger.error(err)
    return { success: false, error: true }
  }
};
export const updateUserStudent = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return { success: true, error: false }
  } catch (err: any) {
    logger.error(err)
    return { success: false, error: true }
  }
};
export const createUserOperator = async (state: stateType, data: UserInputs) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
        operator: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return {success: true, error:false}
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const updateUserOperator = async (state: stateType, data: UserInputs) => {
  try {
    let dataUpdate = {};
    if (data.password === "password") {
      dataUpdate = {
        email: data.username,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      }
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      dataUpdate = {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        isStatus: data.isStatus,
      };
    }

    await prisma.user.update({
      where: {
        id: data.id
      },
      data: dataUpdate,
    })

    return {success: true, error:false}
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}

export const createLecturer = async (state: stateType, data: FormData) => {
  try {
    const dataLecturerRaw = {
      npk: data.get('npk')?.toString(),
      nidn: data.get('nidn')?.toString(),
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
  
      const fileName = `${v4()}-${photo.name}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
      fileUrl = `/uploads/${fileName}`
  
      await writeFile(filePath, buffer)
    }

    const validation = lecturerSchema.safeParse({
      ...dataLecturerRaw,
      photo: fileUrl ?? '', // boleh string kosong
    })

    if (!validation.success) {
      return { success: false, error: true, fieldErrors: validation.error };
    }

    await prisma.lecturer.create({
      data: {
        npk: validation.data.npk,
        nidn: validation.data.nidn,
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const updateLecturer = async (state: stateType, data: FormData) => {
  try {
    const dataLecturerRaw = {
      id: data.get('id')?.toString(),
      npk: data.get('npk')?.toString(),
      nidn: data.get('nidn')?.toString(),
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
      return { success: false, error: true }
    }

    let fileUrl = oldPhoto;
    if (photo && photo.size > 0) {
      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type);
      if (!photoType) throw new Error("Tipe file tidak sesuai");
      
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
      fileUrl = `/uploads/${fileName}`
  
      await writeFile(filePath, buffer)

      if (oldPhoto) {
        const oldPath = path.join(process.cwd(), 'public', oldPhoto);
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const deleteLecturer = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const dataLecturer = await prisma.lecturer.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        photo: true,
        userId: true,
      }
    });

    if (dataLecturer?.userId) {
      await prisma.user.delete({
        where: {
          id: dataLecturer.userId
        }
      })
    }

    await prisma.lecturer.delete({
      where: {
        id: id,
      }
    })

    if (dataLecturer?.photo) {
      const filePath = path.join(process.cwd(), 'public', dataLecturer.photo);
      try {
        await unlink(filePath)
      } catch (err: any) {
        logger.warn(err)
      }
    }
    
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}

export const createStudent = async (state: {success: boolean, error: boolean, fieldErrors: object}, data: FormData) => {
  try {
    const id=data.get('id')?.toString()
    const name = data.get('name')?.toString();
    const nim = data.get('nim')?.toString();
    const photo = data.get('photo') as File
    const year = parseInt(data.get('year') as string);
    const religion = data.get('religion')?.toString() as Religion;
    const gender = data.get('gender')?.toString() as Gender;
    const address = data.get('address')?.toString();
    const email = data.get('email')?.toString();
    const phone = data.get('phone')?.toString();
    const majorId = parseInt(data.get('majorId') as string);
    const lecturerId = data.get('lecturerId')?.toString();
    const fatherName = data.get('fatherName')?.toString();
    const motherName = data.get('motherName')?.toString();
    const guardianName = data.get('guardianName')?.toString();
    const guardianHp = data.get('guardianHp')?.toString();
    const statusRegister = data.get('statusRegister')?.toString();

    let fileUrl: string | undefined = undefined;
    if (photo && photo.size > 0) {

      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type)

      if (!photoType) throw new Error("Tipe file tidak sesuai");
      

      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
      fileUrl = `/uploads/${fileName}`
  
      await writeFile(filePath, buffer)
    }

    const validation = studentSchema.safeParse({
      id,
      name,
      nim,
      year,
      religion,
      gender,
      address,
      email,
      phone,
      majorId,
      lecturerId,
      fatherName,
      motherName,
      guardianName,
      guardianHp,
      statusRegister,
      photo: fileUrl ?? '', // boleh string kosong
    })

    if (!validation.success) {
      return { success: false, error: true, fieldErrors: validation.error };
    }

    await prisma.student.create({
      data: {
        name: validation.data?.name,
        nim: validation.data?.nim,
        year: validation.data?.year,
        religion : validation.data?.religion as Religion,
        gender : validation.data?.gender,
        address : validation.data?.address,
        email : validation.data?.email,
        hp : validation.data?.phone,
        majorId: validation.data?.majorId,
        lecturerId : validation.data?.lecturerId,
        fatherName : validation.data?.fatherName,
        motherName : validation.data?.motherName,
        guardianName : validation.data?.guardianName,
        guardianHp : validation.data?.guardianHp,
        statusRegister : validation.data?.statusRegister,
        photo: fileUrl ?? '', // boleh string kosong
      },
    })
    return { success: true, error: false, fieldErrors: {} };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true, fieldErrors: {}}
  }
}
export const updateStudent = async (state: {success: boolean, error: boolean, fieldErrors: object}, data: FormData) => {
  try {

    const dataRaw = {
      id:data.get('id')?.toString(),
      name : data.get('name')?.toString(),
      nim : data.get('nim')?.toString(),
      year : parseInt(data.get('year') as string),
      religion : data.get('religion')?.toString() as Religion,
      gender : data.get('gender')?.toString() as Gender,
      address : data.get('address')?.toString(),
      email : data.get('email')?.toString(),
      phone : data.get('phone')?.toString(),
      majorId : parseInt(data.get('majorId') as string),
      lecturerId : data.get('lecturerId')?.toString(),
      fatherName : data.get('fatherName')?.toString(),
      motherName : data.get('motherName')?.toString(),
      guardianName : data.get('guardianName')?.toString(),
      guardianHp : data.get('guardianHp')?.toString(),
      statusRegister : data.get('statusRegister')?.toString(),
    }

    const photo = data.get('photo') as File;
    const oldPhoto = data.get('oldFoto') as string;

    const parsed = studentSchema.omit({ photo: true }).safeParse(dataRaw);

    if (!parsed.success) {
      return { success: false, error: true, fieldErrors: parsed.error };
    }

    let fileUrl = oldPhoto;
    if (photo && photo.size > 0) {
      const photoType = ACCEPTED_IMAGE_TYPES.includes(photo.type);
      if (!photoType) throw new Error("Tipe file tidak sesuai");

      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
  
      const fileName = `${v4()}-${photo.name}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
      fileUrl = `/uploads/${fileName}`
  
      await writeFile(filePath, buffer)

      if (oldPhoto) {
        const oldPath = path.join(process.cwd(), 'public', oldPhoto);
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
        year: parsed.data?.year,
        religion : parsed.data?.religion as Religion,
        gender : parsed.data?.gender,
        address : parsed.data?.address,
        email : parsed.data?.email,
        hp : parsed.data?.phone,
        majorId: parsed.data?.majorId,
        lecturerId : parsed.data?.lecturerId,
        fatherName : parsed.data?.fatherName,
        motherName : parsed.data?.motherName,
        guardianName : parsed.data?.guardianName,
        guardianHp : parsed.data?.guardianHp,
        statusRegister : parsed.data?.statusRegister,
        photo: fileUrl,
      }
    })

    return { success: true, error: false, fieldErrors: {} };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true, fieldErrors: {}}
  }
}
export const deleteStudent = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const dataStudent = await prisma.student.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        photo: true,
        userId: true,
      }
    });

    if (dataStudent?.userId) {
      await prisma.user.delete({
        where: {
          id: dataStudent.userId
        }
      })
    }

    await prisma.student.delete({
      where: {
        id: id,
      }
    })

    if (dataStudent?.photo) {
      const filePath = path.join(process.cwd(), 'public', dataStudent.photo);
      try {
        await unlink(filePath)
      } catch (err: any) {
        logger.warn(err)
      }
    }
    
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
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
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}
export const deleteOperator = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    

    await prisma.$transaction([
      prisma.user.delete({
        where: {
          id: id.split(":")[1]
        }
      }),
      prisma.operator.delete({
        where: {
          id: id.split(":")[0]
        }
      })
    ])
    return { success: true, error: false };
  } catch (err: any) {
    logger.error(err)
    return {success: false, error:true}
  }
}