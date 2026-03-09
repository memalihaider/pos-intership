"use client"
import { useState } from "react"
import {Auth} from "../../../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AddStaff(){

    let [data,setData] = useState({email:"",password:""});
    let router = useRouter();

    function handleOnChange(event){

        setData({...data,[event.target.name]:event.target.value});
    }

    async function handleOneSubmit (event){

        event.preventDefault();

        try{

        await createUserWithEmailAndPassword(Auth,data.email,data.password);

        console.log("added")

        router.push("/adminDashBoard")

        }catch(err){
            console.log(err);
        }
    }

    return(
        <>
        <h1>add Staff </h1>

        <form method="post" onSubmit={handleOneSubmit}>
            <input type="email" placeholder="email" name="email" value={data.email} onChange={handleOnChange}></input>
            <input type="password" placeholder="password" name="password" value={data.password} onChange={handleOnChange}></input>
            <button type="submit">Add</button>
        </form>
        </>
    )


}