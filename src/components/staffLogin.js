import Link from "next/link";
export function StaffLogin() {

    return(

    <>
    <h1>satff login Page</h1>

    <Link href="/login/customer">Customer Login</Link>
      <br />
    <Link href="/signup/customer">Customer Signup</Link>
      <br />
      <Link href="/login/admin">Admin Login</Link>

    </>

    )


}