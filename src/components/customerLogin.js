"use client";
import Link from "next/link";
import {useState} from "react";
import {Auth} from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
export function CustomerLogin() {

    let [data,setData] = useState({email:"",password:""});
    const router = useRouter();

    function handleOnchnage(event){

        setData({...data,[event.target.name]:event.target.value })

    }

    async function handleOnsubmit(event){
        event.preventDefault();
        console.log("Form submitted with data:", data); // Debugging log
        try{
        
        await signInWithEmailAndPassword(Auth,data.email,data.password);
        setData({...data,email:"",password:""})
        console.log("User logged in successfully"); 
        console.log("Current user:", Auth.currentUser); // Debugging log to check the current user
        router.push("/userDashBoard")
        
        }catch(error){
            console.error("Error logging in:", error);
        }

    }

    return(

    <>
    <h1>Customer Login Up Page</h1>

    <Link href="/signup/customer">Customer signup</Link>
    <br />
    <Link href="/login/staff">Staff Login</Link>
    <br />
    <Link href="/login/admin">Admin Login</Link>

    <form onSubmit={handleOnsubmit} method="post">
        <input type="email" placeholder="email" name="email" value={data.email} onChange={handleOnchnage} required/>
        <input type="password" placeholder="Password" name="password" value={data.password} onChange={handleOnchnage} required/>
        <button type="submit">Login</button>
    </form>

    </>

    )


}