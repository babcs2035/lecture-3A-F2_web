export function formatDate(datetime: string): string {
  const year = parseInt(datetime.substring(0, 4));
  const month = parseInt(datetime.substring(4, 6)) - 1; // Months are 0-based in JavaScript
  const day = parseInt(datetime.substring(6, 8));
  const hours = parseInt(datetime.substring(9, 11));
  const minutes = parseInt(datetime.substring(11, 13));
  const seconds = parseInt(datetime.substring(13, 15));

  const date = new Date(year, month, day, hours, minutes, seconds);
  return date.toLocaleString(); // Format the date as a locale string
}
