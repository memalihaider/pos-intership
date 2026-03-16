"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function RevenueChart(){

  const [data,setData] = useState([]);

  async function fetchData(){

    const snapShot = await getDocs(collection(db,"orders"));

    const revenueMap = {};

    snapShot.docs.forEach((doc)=>{

      const order = doc.data();

      if(order.createdAt && order.amount){

        const date = order.createdAt.toDate().toLocaleDateString();

        revenueMap[date] =
          (revenueMap[date] || 0) + order.amount;

      }

    });

    const chartData = Object.keys(revenueMap).map((date)=>({
      date,
      amount: revenueMap[date]
    }));

    setData(chartData);
  }

  useEffect(()=>{
    fetchData();
  },[]);

  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
    </LineChart>
  );
}
