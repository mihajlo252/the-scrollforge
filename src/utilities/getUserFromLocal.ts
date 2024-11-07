
export const getUserFromLocal = () => {
  return JSON.parse(JSON.stringify(localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN)))
}
