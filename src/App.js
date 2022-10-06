import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Page,
  Select,
  SkeletonBodyText,
  TextField,
} from "@shopify/polaris";
import "./App.css";
import useFetch from "./useFetch";
import useLeafFetch from "./useLeafFetch";

var commonURL = `https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/`;

var leafURL = `https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/`;

var commonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  appTag: "amazon_sales_channel",
  Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjI5MGRiYjIzOGUyOWExYjIzMzYwY2E5Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjk2NTY4MDE3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2U1ZjUxYWRkZGFlMjIyNjczN2E5MiJ9.m5LW1XQ_w6E8Y_ZAWV-SqoqLUpgyeQXe3R7aGKhCfkxA0h0i2oESFxS3NXvsqU2zBWO9iPa5vobjXypZCEo7ZbjieaowfryVym-Yc2Kc-SkfHJfr7a2QrXxfKql0nBX0SvgEfVdWKxmVb3AK7MyT60gVUCCh82H7ExXntXA46oTvIQkK2rMTC1pCAFxFcWPTUEvz2yfuyLf62533dDfbdWwnYBxOYXrTUBN9E6aOsbl8MDfglV7bRIiKCXF1hTRjyOzUzqp_Tns4kg3oT2zXKpv7mLFcPpEPnYveRP4TGi_N5gRjfyA4o7xAxTHIxmhlRrY7ZEFUx-BcW6aZz7tYNw`,

  "Ced-Source-Id": 500,
  "Ced-Source-Name": "shopify",
  "Ced-Target-Id": 530,
  "Ced-Target-Name": "amazon",
};

function App() {
  const [dataPositionCounter, setDataPositionCounter] = useState(0);
  const [data, setData] = useFetch([]);
  const [leafData, setLeafData] = useLeafFetch([]);
  const [currentOptionValue, setCurrentOptionValue] = useState([]);
  const [leafDataOptions, setLeafDataOptions] = useState({});
  const [showButton, setShowButton] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [lastSkeleton, setLastSkeleton] = useState(false);



  // Initial Calling of API
  useEffect(() => {
    var url = commonURL;
    var options = {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
        user_id: '63329d7f0451c074aa0e15a8',
        selected: [],
        target: {
          marketplace: "amazon",
          shopId: "530",
        },
      }),
    };
    setData(url, options);
  }, []);

  // Functionality for select handling
  useEffect(() => {
    if (currentOptionValue.length === 0) return;
    var pos = -1;
    data[dataPositionCounter].data.map((item, index) =>
      item.name === currentOptionValue[dataPositionCounter]
        ? (pos = index)
        : null
    );
    if (data[dataPositionCounter].data[pos].hasChildren === undefined) {
      alert("Something, Somewhere went terribly wrong!!");
      return;
    }
    if (data[dataPositionCounter].data[pos].hasChildren) {
      var options = {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({
          target_marketplace:
            "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
          user_id: '63329d7f0451c074aa0e15a8',
          selected: data[dataPositionCounter].data[pos].parent_id,
          target: {
            marketplace: "amazon",
            shopId: "530",
          },
        }),
      };
      setData(commonURL, options);
      setDataPositionCounter(dataPositionCounter + 1);
    } else {
      setShowButton(true);
      setShowSkeleton(false);
      setLastSkeleton(true);
      
      var leafOptions = {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({
          target_marketplace:
            "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
          user_id: '63329d7f0451c074aa0e15a8',
          target: {
            marketplace: "amazon",
            shopId: "530",
          },
          data: {
            barcode_exemption: false,
            browser_node_id: data[dataPositionCounter].data[pos].browseNodeId,
            category:
              data[dataPositionCounter].data[pos].category["primary-category"],
            sub_category:
              data[dataPositionCounter].data[pos].category["sub-category"],
          },
        }),
      };
      setLeafData(leafURL, leafOptions);
    }
  }, [currentOptionValue]);

  // Working of final selects
  useEffect(() => {
    if (leafData.length === 0) return;
    setLastSkeleton(false);
    var temp = {};
    Object.values(leafData.data).map((item) => {
      Object.values(item).map((d) => temp[d.label] = {label: d.label, value: d.label, disabled: false});
    });
    setShowSelect(true)
    setLeafDataOptions(temp);
  }, [leafData]);

  // Showing of Skeletons
  useEffect(()=>{
    setShowSkeleton(false);
  },[data])


  // Function for hadling onChange of leaf node
  const handleAttributeChange = (label) => {
    leafDataOptions[label].disabled = true;
    setLeafDataOptions({...leafDataOptions});
    setShowInput(true);
    setShowSelect(false);
  }
  // Function for handling next API call
  const handleButtonClick = () => {
    setShowSelect(true);
  };

  // Function for handling delete
  const handleTextFieldChange = (label) => {
    leafDataOptions[label].disabled = false;
    setLeafDataOptions({...leafDataOptions});
  }


  return (
    <div className="App">
      <div className="block">
        {data.length === 0 ? (
          <Card title="Products Category" sectioned><SkeletonBodyText lines={2}/></Card>
        ) : (
          <span>
            {data.map((item, index) => (
              <Card key={index} sectioned>
                <Select
                  label={
                    index === 0 ? (
                      <Heading>Products Category</Heading>
                    ) : (
                      <Heading>Products Subcategory</Heading>
                    )
                  }
                  placeholder="-Select-"
                  options={item.data.map((d) => {
                    return { label: d.name, value: d.name };
                  })}
                  value={currentOptionValue[index]}
                  onChange={(e) => {
                    currentOptionValue[index] = e;
                    setCurrentOptionValue([...currentOptionValue]);
                    setShowSkeleton(true);
                  }}
                />
              </Card>
            ))}
          </span>
        )}
        <br />
        {showSkeleton && <Card title="Products Subcategory" sectioned><SkeletonBodyText lines={2}/></Card>}
        <br />

        {showButton && <Page sectioned><Button onClick={handleButtonClick} primary>Add Attribute</Button></Page>}

        {leafData.length === 0 ? null : (
          showSelect &&
          <Page>
          <Card sectioned>
            <Select label={<Heading>Product's Attributes</Heading>} placeholder="-Select-" 
            options={Object.values(leafDataOptions)}
            onChange={handleAttributeChange} 
            />
          </Card>
          </Page>
        )}

        <br />
        {lastSkeleton && <Card title="Product's Attributes" sectioned><SkeletonBodyText lines={2}/></Card>}
        <br />

        {showInput && Object.values(leafDataOptions).map((item, i) => item.disabled ?  <TextField
        key={i}
        label={item.label}
        labelAction={{content: 'Delete', onAction: ()=>{handleTextFieldChange(item.label)}}}
        autoComplete="off"
        /> : null)}

        
      </div>
    </div>
  );
}

export default App;
