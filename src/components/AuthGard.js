"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Auth, db } from "../config/firebase";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, async (user) => {

            // // ── DEBUG: open browser console to see these logs ──
            // console.log("=== AuthGuard ===");
            // console.log("Firebase user:", user ? user.email : "null (not logged in)");

            if (!user) {
                console.log("No user → redirecting to login");
                router.replace("/login/admin");
                setChecking(false);
                return;
            }

            try {
                // Query by email
                const q = query(
                    collection(db, "users"),
                    where("email", "==", user.email)
                );
                const snap = await getDocs(q);

                console.log("Firestore docs found:", snap.size);

                if (snap.empty) {
                    // console.log("No Firestore doc for this email → ALLOWING (no doc = assume admin)");
                    setAllowed(true);
                    setChecking(false);
                    return;
                }

                const userData = snap.docs[0].data();
                // console.log("User data from Firestore:", userData);
                // console.log("Role value:", userData.role);
                // console.log("Role type:", typeof userData.role);

                // Trim and lowercase to handle any whitespace or casing issues
                const role = (userData.role || "").trim().toLowerCase();
                // console.log("Role cleaned:", role);

                if (role === "admin") {
                    // console.log("✅ Admin confirmed → allowing access");
                    setAllowed(true);
                } else {
                    // console.log("❌ Not admin, role is:", role, "→ redirecting to login");
                    router.replace("/login/admin");
                }

            } catch (e) {
                // console.error("AuthGuard Firestore error:", e);
                // // Network/permission error → still allow authenticated user through
                // console.log("Error occurred → allowing authenticated user through");
                setAllowed(true);
            } finally {
                setChecking(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (checking) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "100vh", fontFamily: "Inter, sans-serif", color: "#64748b"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 36, height: 36,
                        border: "3px solid #e2e8f0",
                        borderTopColor: "#6366f1",
                        borderRadius: "50%",
                        animation: "spin 0.75s linear infinite",
                        margin: "0 auto 12px"
                    }} />
                    <p>Verifying access...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!allowed) return null;

    return children;
}