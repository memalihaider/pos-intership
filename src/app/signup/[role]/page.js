"use client"
import { use } from "react";
import { CustomerSignup } from "../../../components/customerSignup";
import { notFound } from "next/navigation";


export default function SignupPage({ params }) {

    let { role } = use(params);

    if (!role) return notFound();

    if(role==="customer"){
        return <CustomerSignup/>
    }




}