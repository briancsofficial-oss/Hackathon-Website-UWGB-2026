// DEMO ONLY: hard-coded credentials checked in the browser. Replace with real auth (NextAuth/Clerk/etc.) before launch.
export const DEMO_USERNAME = "admin";
export const DEMO_PASSWORD = "safety123";
const KEY = "smartflow:session";

export function signIn(username: string, password: string) {
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}
export const isSignedIn = () => typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";
export function signOut() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem("smartflow:data");
}
