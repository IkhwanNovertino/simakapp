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