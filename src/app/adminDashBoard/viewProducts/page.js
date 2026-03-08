"use client"
import {db} from "../../../config/firebase"
import {collection,getDocs} from "firebase/firestore"
import Link from "next/link";
import { useState,useEffect } from "react";

export default function ViewProducts(){

    let [product,setProduct] = useState([]);

    async function fetchProducts(){

        let actualProducts = await getDocs(collection(db,"product"))
        // console.log(actualProducts);
        let filerProducts = actualProducts.docs.map((doc)=>{
            return {id: doc.id, ...doc.data()};
        })
        console.log(filerProducts);
        setProduct(filerProducts)

        // console.log(product);
        console.log("fethced successfully")

    }

    useEffect(()=>{
        fetchProducts();
    },[])   


    return (
        <>
        <h1>View Products</h1>

         {product.map((item)=>(
            <div key={item.id} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>
                <p><b>Name:</b> {item.name}</p>
                <p><b>Category:</b> {item.category}</p>
                <p><b>Price:</b> {item.price}</p>
                <p><b>Cost Price:</b> {item.costPrice}</p>
                <p><b>Stock:</b> {item.stock}</p>
                <Link href={`/adminDashBoard/editProduct/${item.id}`}>Edit</Link>
                <Link href={`/adminDashBoard/deleteProduct/${item.id}`}>Delete</Link>
            </div>
        ))}
        
        </>
    )
}   