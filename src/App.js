import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Select,
  SkeletonBodyText,
  SkeletonPage,
  Spinner,
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
  Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY0OTg4NjM3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2Q3ZDlkYjgyM2I5MTVhMzc0NTA3NSJ9.eZKlcA00P9R_hw-ThPqMP1G_ntdht2hoh2Sx9FhfFXsw1725An17BDLLEA5GYGEXr-vtrUMoWq2E7_sRAkFvvbBrEljQenYRUH0VxIdgFvUk3ptoh9_x63ZhOpS2LhW0v5G16fZiY4StoArQZ3TVRrzqf9b5ZGVrlxh7RjR6oZEzLg6UHqPdYXn5o1J0FdoyCndaDo8y3XwNBPUJU1BqnVMxeYYFnYlxWCpH1jq8IjSrP1YSQARMZhAfqrxuN73utQMwf5EYR4_2fM8Iz-LiwN7wVkRkoj7hDTeQtVx_736tycu6f4lLf03CZ0mxzrbAXuifl3eJsHKso0lgL4UxPg`,

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
      var leafOptions = {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify({
          target_marketplace:
            "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
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
    var temp = {};
    Object.values(leafData.data).map((item) => {
      Object.values(item).map((d) => temp[d.label] = {label: d.label, value: d.label, disabled: false});
    });
    setShowSelect(true)
    setLeafDataOptions(temp);
  }, [leafData]);


  console.log(data);
  console.log(leafData);
  console.log(leafDataOptions);
  console.log(showSelect);

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
  return (
    <div className="App">
      <div className="block">
        {data.length === 0 ? (
          <Spinner size="small" />
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
                  }}
                />
              </Card>
            ))}
          </span>
        )}
        {showButton && <Button onClick={handleButtonClick} primary>Add Attribute</Button>}

        {showInput && Object.values(leafDataOptions).map((item, i) => item.disabled ?  <TextField key={i} label={item.label}/> : null)}

        {leafData.length === 0 ? null : (
          showSelect &&
          <Card sectioned>
            <Select label={<Heading>Product's Attributes</Heading>} placeholder="-Select-" 
            options={Object.values(leafDataOptions)}
            onChange={handleAttributeChange} 
            />
          </Card>
        )}
        
      </div>
    </div>
  );
}

export default App;
