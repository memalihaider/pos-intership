"use client"

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function ProductChart(){

  const [data,setData] = useState([]);

  async function fetchSales(){

    const snapShot = await getDocs(collection(db,"orders"));

    const productMap = {};

    snapShot.docs.forEach((doc)=>{

      const order = doc.data();

      // check if items exist and is array
      if(Array.isArray(order.items)){

        order.items.forEach((item)=>{

          const name = item.name;
          const quantity = item.quantity || 0;

          if(!name) return;

          if(productMap[name]){
            productMap[name] += quantity;
          }else{
            productMap[name] = quantity;
          }

        });

      }

    });

    const chartData = Object.keys(productMap).map((product)=>({
      name: product,
      quantity: productMap[product]
    }));

    setData(chartData);
  }

  useEffect(()=>{
    fetchSales();
  },[]);

  return(

    <div style={{width:"600px"}}>

      <h2>Product Sales</h2>

      <BarChart
        width={600}
        height={300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="quantity" fill="#8884d8"/>
      </BarChart>

    </div>

  )
}
