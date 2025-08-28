import { exportAssessmentGrade } from "@/lib/excel/exportAssessmentGrade";
import { exportAssessmentTemplate } from "@/lib/excel/exportAssessmentTemplate";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const academicClassId = searchParams.get('academicClassId');
    const template = searchParams.get('template');
  
    if (!academicClassId) {
      return new NextResponse('Missing Params', { status: 400 });
    };
    const academicClass = await prisma.academicClass.findUnique({
      where: { id: academicClassId },
      select: {
        id: true,
        name: true,
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const bufferFile = template ? await exportAssessmentTemplate(academicClassId) : await exportAssessmentGrade(academicClassId)
    return new NextResponse(bufferFile, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${academicClass?.course?.name}-${academicClass?.name}.xlsx"`,
      },
    });
  } catch (err) {
    logger.error(err)
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}