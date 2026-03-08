"use client"
import {db} from "../../../config/firebase"
import {collection,addDoc} from "firebase/firestore"
import { useState,useEffect } from "react";

export default function AddProduct(){
    let [data,setData] = useState({name:"",category:"",price:0,costPrice:0,stock:0});

    async function handleOneSubmit(event){

        event.preventDefault();
        // try{

            await addDoc(collection(db,"product"),
            {
                name:data.name,
                category:data.category,
                price:data.price,
                costPrice:data.costPrice,
                stock:data.stock,
            }
        )
        event.target.reset();
        console.log("product added successfully")
        // }catch(error){

        //     console.log(error);
        // }

    }
    return (
        <>
        <h1>Add Product</h1>
        <form onSubmit={handleOneSubmit} method="post">
            <input type="text" placeholder="Name" onChange={(e)=>setData({...data,name:e.target.value})}/>
            <input type="text" placeholder="Category" onChange={(e)=>setData({...data,category:e.target.value})}/>
            <input type="number" placeholder="Price" onChange={(e)=>setData({...data,price:Number(e.target.value)})}/>
            <input type="number" placeholder="Cost Price" onChange={(e)=>setData({...data,costPrice:Number(e.target.value)})}/>
            <input type="number" placeholder="Stock" onChange={(e)=>setData({...data,stock:Number(e.target.value)})}/>
  
            <button type="submit">Add Product</button>
        </form>
        </>
    )
}