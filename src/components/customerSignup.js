"use client";
import Link from "next/link";
import { useState } from "react";
import {Auth} from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function CustomerSignup() {

  let [data,setData] = useState({email:"",password:"",confirmPassword:""});
  function handleOnchange(event){

  // console.log(event.target.name)
  // console.log(event.target.value)
  setData({...data,[event.target.name]:event.target.value })
  }

  async function handleSubmit(event){

    console.log("Form submitted with data:", data); // Debugging log
    event.preventDefault();
    try{
      if(data.password !== data.confirmPassword){
        alert("Passwords do not match!");
        return;
      }
    let Data = await createUserWithEmailAndPassword(Auth, data.email, data.password);
    console.log("User created:", Data.user); 
    event.target.reset();
    }catch(error){
      console.error("Error creating user:", error);
    }

  }
  return (
    <>
      <h1>Customer Sign Up Page</h1>

      <Link href="/login/customer">Customer Login</Link>
      <br />
      <Link href="/login/staff">Staff Login</Link>
      <br />
      <Link href="/login/admin">Admin Login</Link>

      <form onSubmit={handleSubmit} method="post">
        <input type="email" placeholder="email" value={data.email} name="email" onChange={handleOnchange} required/>
        <input type="password" placeholder="Password" value={data.password} name="password" onChange={handleOnchange} required/>
        <input type="password" placeholder="Confirm Password" value={data.confirmPassword}   name="confirmPassword" onChange={handleOnchange} required/>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
