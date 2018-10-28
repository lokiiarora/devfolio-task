const computeDummyItems = items => {
    let dummyItems = [];
    if(items.length > 10) {
        dummyItems = items.slice(0,10).map(val => ({val:val, type:"data"}));
      }else {
        if(items.length === 9) {
          dummyItems = items.map(val => ({val:val, type:"data"}));
          dummyItems[items.length] = {val:"", type:"input"}
        }else {
          dummyItems = items.map(val => ({val:val, type:"data"}));
          dummyItems[items.length] = {val:"", type: "input"};
          for(let iter = items.length + 1; iter <= 9; iter++) {
            dummyItems[iter] = {val:"", type:"disabled"}
          } 
        }
      }
    return dummyItems;
}


export default computeDummyItems;