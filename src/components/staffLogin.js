"user client";
import {useState} from "react";
import {Auth} from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export function StaffLogin() {

  let [data,setData] = useState({email:"",password:""});

  function handleOnchnage(event){

    setData({...data,[event.target.name]:event.target.value })        
  }

  async function handleOnsubmit(event){
    event.preventDefault();
    console.log("Form submitted with data:", data); // Debugging log
    try{
    await signInWithEmailAndPassword(Auth,data.email,data.password);        

    }catch(error){
        console.error("Error logging in:", error);
    }   

  }

    return(

    <>
    <h1>satff login Page</h1>

    <Link href="/login/customer">Customer Login</Link>
      <br />
    <Link href="/signup/customer">Customer Signup</Link>
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