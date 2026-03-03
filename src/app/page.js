import Link from "next/link";
import { CustomerSignup } from "../components/customerSignup";

export default function Home() {
  return (
    <>
      {/* <h1>Main Page</h1> */}
      <Link href="/login/customer">Customer Login</Link>
      <br />
      <Link href="/login/admin">Admin Login</Link>
      <br />
      <Link href="/login/staff">Staff Login</Link>

      <CustomerSignup/>

    </>
  );
}
