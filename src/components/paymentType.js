"use client"

import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function PaymentTypeChart() {
  const [data, setData] = useState([]);

  async function fetchData() {
    const snapShot = await getDocs(collection(db, "orders"));
    const paymentMap = {};

    snapShot.docs.forEach((doc) => {
      const order = doc.data();
      const type = order.paymentType;
      if (type) {
        paymentMap[type] = (paymentMap[type] || 0) + 1;
      }
    });

    const chartData = Object.keys(paymentMap).map((type) => ({
      name: type,
      value: paymentMap[type]
    }));

    setData(chartData);
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius="60%"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 12
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}