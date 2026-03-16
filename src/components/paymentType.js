"use client"

import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function PaymentTypeChart(){

  const [data,setData] = useState([]);

  async function fetchData(){

    const snapShot = await getDocs(collection(db,"orders"));

    const paymentMap = {};

    snapShot.docs.forEach((doc)=>{

      const order = doc.data();
      const type = order.paymentType;

      if(type){
        paymentMap[type] =
          (paymentMap[type] || 0) + 1;
      }

    });

    const chartData = Object.keys(paymentMap).map((type)=>({
      name: type,
      value: paymentMap[type]
    }));

    setData(chartData);
  }

  useEffect(()=>{
    fetchData();
  },[]);

  return (
    <PieChart width={400} height={300}>

      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      {/* ✅ This adds color explanation */}
      <Legend />

      <Tooltip />

    </PieChart>
  );
}
