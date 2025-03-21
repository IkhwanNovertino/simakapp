"use server";

import { revalidatePath } from "next/cache";
import { PermissionInputs } from "./formValidationSchema";
import { prisma } from "./prisma";

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
  console.log('deletePermission exe');
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