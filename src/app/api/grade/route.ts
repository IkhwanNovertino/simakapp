import { exportAssessment } from "@/lib/excel/exportAssessment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const academicClassId = searchParams.get('academicClassId');
  
  if (!academicClassId) {
    return new NextResponse('Missing Params', { status: 400 });
  }

  const bufferFile = await exportAssessment(academicClassId);

  return new NextResponse(bufferFile, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="assessment-${academicClassId}.xlsx"`,
    },
  });
}