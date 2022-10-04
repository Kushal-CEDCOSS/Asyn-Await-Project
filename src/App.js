import React, { useEffect, useState } from "react";
import { Heading, Select, Spinner } from "@shopify/polaris";
import "./App.css";
import useFetch from "./useFetch";


var commonURL = `https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/`;
var commonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  appTag: "amazon_sales_channel",
  Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY0ODk2ODY1LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2MxNzIxNmU0ZmJkNDk5NjVjMzZjNCJ9.eOBNKusfwSwBa-R_k54HUHZ5GUpobq6LKVy5-7voA3FYet9bTo8kky9RImOIcaDAy2GmSkovXt9vktcQXmUMdd9BSPR20sAs6D5sIA8fNHeHngmAY3cacjtNEgXZn2MmVMXIQUCnDXJuLh8zgiIskjQurOeC4ldaR-sqHddIKxoemfyoz8flY2gSiocvBsUxnXAhkytGCKxB9CEmhYMAFwYdGsI7ANAJnfSGLhrS9zqMNjpRv__9RzyUNirupPb1ruCgCVcPtLQLaT_K-Md3DH6_5iD0wJgs4FL-I1DYQmVeq4RdaBfV-OkAlirE5vcavfas2nwi3QZIertYSXVY5A`,

  "Ced-Source-Id": 500,
  "Ced-Source-Name": "shopify",
  "Ced-Target-Id": 530,
  "Ced-Target-Name": "amazon",
} 

function App() {
  const [positionCounter, setPositionCounter] = useState(0);
  const [data, setData] = useFetch([]);
  const [options, setOptions] = useState([]);

  // Initial Calling of API
  useEffect(() => {
    var url = commonURL;
    var options = {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        selected: [],
        target: {
          marketplace: "amazon",
          shopId: "530",
        },
      }),
    };
    setData(url, options);
  }, []);


  // Code for handling changes in the select tag
  useEffect(()=>{
    if(data.length === 0) return;
    var temp = [...options];
    temp[positionCounter]= [data.data];
    console.log(temp);    
  },[data])

  console.log(data);
  return (
    <div className="App">
      <div className="block">
        {data.length === 0 ? (
          <Spinner size="small" />
        ) : 
        (
          Array(data.length).fill(0).map(item => 
          <Select 
          
          />)
        )    
      }
      </div>
    </div>
  );
}

export default App;
