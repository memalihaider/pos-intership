import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Main Page</h1>
      <Link href="/login/customer">Customer Login</Link>
      <br />
      <Link href="/signup/customer">Customer Signup</Link>
      <br />
      <Link href="/login/admin">Admin Login</Link>
      <br />
      <Link href="/login/staff">Staff Login</Link>
    </div>
  );
}
