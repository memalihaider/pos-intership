"use client";
import Link from "next/link";
import {useState} from "react";
import {Auth} from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
export function CustomerLogin() {

    let [data,setData] = useState({email:"",password:""});

    function handleOnchnage(event){

        setData({...data,[event.target.name]:event.target.value })

    }

    async function handleOnsubmit(event){
        event.preventDefault();
        console.log("Form submitted with data:", data); // Debugging log
        try{
        await signInWithEmailAndPassword(Auth,data.email,data.password);
        event.target.reset();
        console.log("User logged in successfully"); 
        console.log("Current user:", Auth.currentUser); // Debugging log to check the current user
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