"user client"
import Link from "next/link";
export default function AdminDashBoard(){

    return (

        <>

        <h1>admin DashBoard</h1>
        <Link href="/adminDashBoard/addProduct">Add Product</Link>
        <br/>
        <Link href="/adminDashBoard/viewProducts">View Products</Link>
        <br/>
        <Link href="/adminDashBoard/viewOrders">View Orders</Link>
        <br/>
        <Link href="/adminDashBoard/viewCustomers">View Customers</Link>
        <br/>
        <Link href="/adminDashBoard/addStaff">Add Staff</Link>
        <br/>
        <Link href="/adminDashBoard/viewStaff">View Staff</Link>
        




        
        
        </>
    )
}
