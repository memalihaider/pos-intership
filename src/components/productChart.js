"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  async function fetchData() {
    const snapShot = await getDocs(collection(db, "orders"));
    const revenueMap = {};

    snapShot.docs.forEach((doc) => {
      const order = doc.data();
      if (order.createdAt && order.amount) {
        const date = order.createdAt.toDate().toLocaleDateString();
        revenueMap[date] = (revenueMap[date] || 0) + order.amount;
      }
    });

    const chartData = Object.keys(revenueMap).map((date) => ({
      date,
      amount: revenueMap[date]
    }));

    setData(chartData);
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 16, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 12
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3, fill: "#10b981" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}