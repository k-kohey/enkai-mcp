export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthDateToDayNameMap(
  month: number = new Date().getMonth() + 1,
  year: number = new Date().getFullYear()
): Record<string, string> {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  const daysMap: Record<string, string> = {};
  const daysInTargetMonth = getDaysInMonth(year, month);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (let day = 1; day <= daysInTargetMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toISOString();
    daysMap[dateString] = dayNames[dayOfWeek];
  }
  return daysMap;
}
