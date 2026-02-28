"use client"
import{db} from "../config/firebase"
import{useState,useEffect} from "react"
import {collection,addDoc,getDocs} from "firebase/firestore";

export default function TestData() {

    let [name,setName]=useState("");
    let [age,setAge]=useState("");
    let [data,setData]=useState([]);

    const ref = collection(db,"testUser");

    function setOnchange(event){
        if(event.target.name==="name"){
            setName(event.target.value);
    }    else if(event.target.name==="age"){
            setAge(event.target.value);
    }
}

    async function handleSubmit(){

        const docRef = await addDoc(collection(db, "testUser"), {
            name: name,
            age: age
          });
          console.log("Document written with ID: ", docRef.id); 
    

    }
    async function getdata(){
        let gettingdata = await getDocs(ref);
        let filterdata = gettingdata.docs.map((doc)=>doc.data());
        setData([...data,filterdata])
        console.log(data);

    
    }

    useEffect(()=>{
        getdata();
    },[])
    
    return(

        <>
        <input type="text" placeholder="name" name="name" value={name} onChange={setOnchange}/>
        <input type="number" placeholder="age" name="age" value={age} onChange={setOnchange}/>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={getdata}>getdata</button>
        {/* <div>{data}</div> */}
        
        </>
    )

}