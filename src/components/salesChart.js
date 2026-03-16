"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function SalesChart(){

  const [data,setData] = useState([]);

  async function fetchSales(){

    const snapShot = await getDocs(collection(db,"orders"));

    const salesData = snapShot.docs.map((doc)=>{

      const order = doc.data();

      return {
        id: doc.id,
        amount: order.amount,
        date: order.createdAt?.toDate().toLocaleDateString()
      };

    });

    setData(salesData);
  }

  useEffect(()=>{
    fetchSales();
  },[]);

  return(
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#8884d8"/>
    </LineChart>
  )
}
