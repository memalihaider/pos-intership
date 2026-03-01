
import Link from "next/link";
export function CustomerLogin() {

    return(

    <>
    <h1>Customer Login Up Page</h1>

    <Link href="/signup/customer">Customer signup</Link>
    <br />
    <Link href="/login/staff">Staff Login</Link>
    <br />
    <Link href="/login/admin">Admin Login</Link>

    </>

    )


}