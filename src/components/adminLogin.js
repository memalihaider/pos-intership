import Link from "next/link";
export function AdminLogin() {

    return(

    <>
    <h1>admin login Page</h1>

    <Link href="/login/customer">Customer Login</Link>
    <br />
    <Link href="/signup/customer">Customer Signup</Link>
    <br />
    <Link href="/login/staff">Staff Login</Link>
    <br />
     

    </>

    )


}