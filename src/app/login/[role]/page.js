"use client";
import { use } from "react";

import {CustomerSignup} from "../../../components/customerSignup";
import {AdminLogin} from "../../../components/adminLogin";
import {StaffLogin} from "../../../components/staffLogin"; 
import { notFound } from "next/navigation";      
import { CustomerLogin } from "@/components/customerLogin";
export default function LoginPage({ params }) {
   const { role } = use(params);

  if (!role) return notFound();

  console.log("Role:", role); // Debugging log     

  switch (role) {
    case "customer":
      return <CustomerLogin />;
    case "admin":
      return <AdminLogin />;
    case "staff":
      return <StaffLogin />;
    default:
      return notFound();    
  }
}
