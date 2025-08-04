
export const calculatingSKSLimits = async (ipk: number) => {
  // const ipkFloat = Number(ipk);
  // 2.35
  if (ipk < 1.5) {
    return "12"
  } else if (ipk >= 1.5 && ipk <= 1.99) {
    return "13-16"
  } else if (ipk >= 2.00 && ipk <= 2.49) {
    return "17-18"
  } else if (ipk >= 2.50 && ipk <= 2.99) {
    return "19-20"
  } else if (ipk >= 3.00 && ipk <= 3.49) {
    return "21-22"
  } else {
    return "23-24"
  }
};

interface LecturerName {
  frontTitle?: string | null | undefined,
  name: string | null | undefined,
  backTitle?: string | null | undefined,
}
export const lecturerName = async ({ frontTitle, name, backTitle }: LecturerName) => {
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
} 