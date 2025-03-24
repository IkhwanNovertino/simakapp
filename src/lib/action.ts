"use server";

import { revalidatePath } from "next/cache";
import { MajorInputs, PermissionInputs, RoleInputs, RolePermissionInputs, RoomInputs } from "./formValidationSchema";
import { prisma } from "./prisma";
import { parse } from "node:path";

type stateType = {
  success: boolean;
  error: boolean
}

export const createPermission = async (state: stateType, data: PermissionInputs) => {
  try {
    await prisma.permission.create({
      data: {
        name: data.name,
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
        name: data.name,
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
    await prisma.permission.delete({
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

export const createRole = async (state: stateType, data: RoleInputs) => {
  try {
    console.log(data?.rolePermission);
    await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        RolePermission: {
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
    console.log(id);
    
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

export const deleteRolePermission = async (state: stateType, data: FormData) => {
  try {
    const id = data.get("id") as string;
    console.log(id);
    
    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId: parseInt(id.split(":")[0]),
          permissionId: parseInt( id.split(":")[1]),
        }
      }
    })


    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
  }
}

export const createRolePermission = async (state: stateType, data: RolePermissionInputs) => {
  try {
    await prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permission
      }
    })

    return { success: true, error: false };
  } catch (err: any) {
    console.log(`${err.name}: ${err.message}`);
    return {success: false, error:true}
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