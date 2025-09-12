export const calculatingSKSLimits = async (ipk: number) : Promise<number>  => {

  if (ipk < 1.5) {
    return 12
  } else if (ipk >= 1.5 && ipk <= 1.99) {
    return 16
  } else if (ipk >= 2.00 && ipk <= 2.49) {
    return 18
  } else if (ipk >= 2.50 && ipk <= 2.99) {
    return 20
  } else if (ipk >= 3.00 && ipk <= 3.49) {
    return 22
  } else {
    return 24
  }
};

export const lecturerName = async (
  { 
    frontTitle, name, backTitle 
  }: {
  frontTitle?: string | null | undefined,
  name: string | null | undefined,
  backTitle?: string | null | undefined,
}) => {
  return `${frontTitle ? frontTitle + " " : ""}${name}${backTitle ? ", " + backTitle : ""}`
}

export const getGradeLetter = (finalScore: number): [string, number] => {
  if (finalScore >= 85) return ["A", 4]
  if (finalScore >= 80 && finalScore < 85) return ["AB", 3.5]
  if (finalScore >= 70 && finalScore < 80) return ["B", 3]
  if (finalScore >= 60 && finalScore < 70) return ["BC", 2.5]
  if (finalScore >= 56 && finalScore < 60) return ["C", 2]
  if (finalScore >= 40 && finalScore < 56) return ["D", 1]
  return ["E", 0]
}

export const getFinalScore = (grade?: any[] ): {finalScore: number, gradeLetter: string, gradeWeight: number} => {

  if (!grade || grade.length === 0) return {finalScore: 0, gradeLetter: "E", gradeWeight: 0};
  const totalScore = grade.reduce((acc, curr) => {
    return acc + (Number(curr.score)* (Number(curr.percentage) / 100));
  }, 0);

  const gradeLetter = getGradeLetter(totalScore);
  
  return {
    finalScore: totalScore,
    gradeLetter: gradeLetter[0],
    gradeWeight: gradeLetter[1],
  };
};

export const previousPeriod = async (data: {semesterType: string, year: number}): Promise<{ semesterType: string, year: number }> => {

  const currentPeriodSemester = data.semesterType;
  const currentPeriodYear = data.year;
  const lastPeriodSemester = currentPeriodSemester === "GANJIL" ? "GENAP" : "GANJIL";
  const lastPeriodYear = currentPeriodSemester === "GANJIL" ? currentPeriodYear : currentPeriodYear - 1;
  return {
    semesterType: lastPeriodSemester,
    year: lastPeriodYear,
  }
}

const getLatestMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);
  return latestMonday;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date, dayName: string }[]
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday();
  const dayNumber: {[key: string]: number} = {
    MINGGU: 0,
    SENIN: 1, 
    SELASA: 2, 
    RABU: 3, 
    KAMIS: 4, 
    JUMAT: 5, 
    SABTU: 6, 
  }

  return lessons.map((lesson) => {
    const lessonDayOfWeek = dayNumber[lesson.dayName];
    console.log("lessonDayOfWeek", lessonDayOfWeek);
    
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};

