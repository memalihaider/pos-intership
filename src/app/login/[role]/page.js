"use client";
import { use } from "react";
import {AdminLogin} from "../../../components/adminLogin";
import {StaffLogin} from "../../../components/staffLogin"; 
import { notFound } from "next/navigation";      
import { CustomerLogin } from "@/components/customerLogin";
export default function LoginPage({ params }) {
   const { role } = use(params);

  if (!role) return notFound();

  // console.log("Role:", role); // Debugging log     

    if(role=="customer") {
      return <CustomerLogin />;
    }
    else if(role=="admin") {
      return <AdminLogin />;
    }   
    else if(role=="staff") {
      return <StaffLogin />;
    }
    else{
      return notFound();
    }
}
