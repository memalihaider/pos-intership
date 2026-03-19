"use client"
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Auth } from "../config/firebase";

// ✅ Must start with "use" so React knows it's a hook
export function useLogout() {
    const router = useRouter();

    async function logout() {
        try {
            await signOut(Auth);
            router.push("/login/admin");
        } catch (e) {
            console.error("Logout error:", e);
        }
    }

    return logout;
}