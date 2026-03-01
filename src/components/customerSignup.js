import Link from "next/link";

export function CustomerSignup() {
  return (
    <>
      <h1>Customer Sign Up Page</h1>

      <Link href="/login/customer">Customer Login</Link>
      <br />
      <Link href="/login/staff">Staff Login</Link>
      <br />
      <Link href="/login/admin">Admin Login</Link>
    </>
  );
}
