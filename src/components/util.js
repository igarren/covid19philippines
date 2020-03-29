export const toDateString = date => {
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() + offset * 60 * 1000)
  return date.toISOString().split("T")[0];
}

export const toDateTimeString = date => {
  date = new Date(date)
  return date.toString().split('(')[0];
}
