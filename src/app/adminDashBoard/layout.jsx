// app/adminDashBoard/layout.jsx
// This file wraps EVERY page inside /adminDashBoard automatically.
// You don't need to touch any individual page file.

import AuthGuard from "../../components/AuthGard";

export default function AdminLayout({ children }) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}