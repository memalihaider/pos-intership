"use client"

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function SalesChart() {
  const [data, setData] = useState([]);

  async function fetchSales() {
    const snapShot = await getDocs(collection(db, "orders"));
    const salesData = snapShot.docs.map((doc) => {
      const order = doc.data();
      return {
        id: doc.id,
        amount: order.amount,
        date: order.createdAt?.toDate().toLocaleDateString()
      };
    });
    setData(salesData);
  }

  useEffect(() => { fetchSales(); }, []);

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
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3, fill: "#6366f1" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}