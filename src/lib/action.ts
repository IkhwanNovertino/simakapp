"use server";

import { revalidatePath } from "next/cache";
import { CourseInputs, LecturerInputs, MajorInputs, OperatorInputs, PermissionInputs, RoleInputs, RolePermissionInputs, RoomInputs, StudentInputs, UserInputs } from "./formValidationSchema";
import { prisma } from "./prisma";
import { connect } from "http2";
import { Religion } from "@prisma/client";
import { permission } from "process";
import { parse } from "path";
import bcrypt from "bcryptjs";

type stateType = {
  success: boolean;
  error: boolean
}

export const createPermission = async (state: stateType, data: PermissionInputs) => {
  try {
    console.log("actionCreatePermission running");
    const name = data.action + ":" + data.resource;
    
    await prisma.permission.create({
      data: {
        name: name,
        description: data.description,
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const deletePermission = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const transactionDeletePermission = await prisma.$transaction([
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const updateRole = async (state: stateType, data: RoleInputs) => {
  try {
    console.log(data);   
    await prisma.role.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        // RolePermission: {
        //   set: data?.rolePermission.map((id: number) => ({permissionId: id})),
        // }
      }
    })
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const deleteRole = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    
    const transactionDelete = await prisma.$transaction([
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
    console.log(`${err.name}: ${err.message}`);
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
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
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
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
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
      }
    });
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}

export const createUserLecturer = async (state: stateType, data: UserInputs) => {
  try {
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        lecturer: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return {success: true, error:false}
  } catch (err) {
    console.log(err);
    return {success: false, error:true}
  }
}
export const createUserStudent = async (state: stateType, data: UserInputs) => {
  try {
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        student: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return {success: true, error:false}
  } catch (err) {
    console.log(err);
    return {success: false, error:true}
  }
}
export const createUserOperator = async (state: stateType, data: UserInputs) => {
  try {
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.user.create({
      data: {
        email: data.username,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
        operator: {
          connect: {
            id: data?.id
          }
        }
      },
    })

    return {success: true, error:false}
  } catch (err) {
    console.log(err);
    return {success: false, error:true}
  }
}

export const createLecturer = async (state: stateType, data: LecturerInputs) => {
  try {
    console.log(data)
    await prisma.lecturer.create({
      data: {
        npk: data.npk,
        nidn: data.nidn,
        name: data.name,
        frontTitle: data.frontTitle,
        backTitle: data.backTitle,
        degree: data.degree,
        year: data.year,
        address: data.address,
        majorId: data.majorId,
        gender: data.gender,
        hp: data.phone,
        email: data.email,
        religion: data.religion as Religion,
      }
    })

    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const updateLecturer = async (state: stateType, data: LecturerInputs) => {
  try {
    await prisma.lecturer.update({
      where: {
        id: data?.id
      },
      data: {
        name: data.name,
        email: data.email,
        hp: data.phone,
      }
    })
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const deleteLecturer = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    const deleteOperatorTransaction = await prisma.$transaction([
      prisma.user.delete({
        where: {
          id: id.split(":")[1]
        }
      }),
      prisma.lecturer.delete({
        where: {
          id: id.split(":")[0]
        }
      })
    ])
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}

export const createOperator = async (state: stateType, data: OperatorInputs) => {
  try {
    const createOperatorUser = await prisma.operator.create({
      data: {
        name: data.name,
        department: data?.department,
      }
  })
    // const [createUser, createOperatorUser] = await prisma.$transaction(async (prisma) => {
    //   const createUser = await prisma.user.create({
    //     data: {
    //       email: data.username,
    //       password: data.password,
    //       roleId: parseInt(data.roleId),
    //     }
    //   });
    //   const createOperatorUser = await prisma.operator.create({
    //       data: {
    //         name: data.name,
    //         department: data?.department,
    //         userId: createUser.id
    //       }
    //   })
    //   return [createUser, createOperatorUser];
    // })
    
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
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
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const deleteOperator = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    console.log(id.split(":")[0]);
    console.log(id.split(":")[1]);
    

    const deleteOperatorTransaction = await prisma.$transaction([
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
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}

export const createStudent = async (state: stateType, data: StudentInputs) => {
  try {
    console.log(data);
    const student = await prisma.student.create({
      data: {
        nim: data.nim,
        name: data.name,
        majorId: data.majorId,
        year: data.year,
        gender: data.gender,
        hp: data.phone,
        email: data.email,
        lecturerId: data.lecturerId,
        address: data.address,
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianName: data.guardianName,
        guardianHp: data.guardianHp,
        statusRegister: data.statusRegister,
        religion: data.religion as Religion,
      }
    })
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const updateStudent = async (state: stateType, data: StudentInputs) => {
  try {
    // await prisma.operator.update({
    //   where: {
    //     id: data?.id
    //   },
    //   data: {
    //     name: data.name,
    //     department: data?.department,
    //   }
    // })
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}
export const deleteStudent = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    console.log(id.split(":")[0]);
    console.log(id.split(":")[1]);
    

    const deleteOperatorTransaction = await prisma.$transaction([
      prisma.user.delete({
        where: {
          id: id.split(":")[1]
        }
      }),
      prisma.student.delete({
        where: {
          id: id.split(":")[0]
        }
      })
    ])
    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}