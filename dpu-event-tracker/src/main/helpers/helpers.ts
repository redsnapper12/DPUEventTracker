import { Student } from "../../types/electron";

// The month that a new academic year starts. !!(JS months are indexed starting at 0)!!
const ACADEMIC_YEAR_START_MONTH = 8;

export enum ClassName {
  Senior = "Senior",
  Junior = "Junior",
  Sophomore = "Sophomore",
  Freshman = "Freshman",
  Unknown = "Unknown",
}

export function GetClassNameByYear(
  class_year: string,
  currentDate: Date = new Date()
): ClassName {
  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth() + 1;

  const yearDifference: number = parseInt(class_year) - currentYear;

  // Check if the current month is after August. If the current month is before the academic year starts,
  // we know a student with a grad year of current year + 4 is a freshman.
  if (!(currentMonth >= ACADEMIC_YEAR_START_MONTH)) yearDifference + 1;

  switch (yearDifference) {
    case 1:
      return ClassName.Senior;
    case 2:
      return ClassName.Junior;
    case 3:
      return ClassName.Sophomore;
    case 4:
      return ClassName.Freshman;
    default:
      return ClassName.Unknown;
  }
}

export function GetClassCount(students: Student[], className: ClassName) {
  let count = 0;

  students.forEach((element) => {
    let year = GetClassNameByYear(element.classYear);

    if (year == className) count++;
  });

  return count;
}

export function HasPreferredName(student: Student) {
  return student.preferredName != "N/A";
}
