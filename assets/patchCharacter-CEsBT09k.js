const t=(a,r)=>{localStorage.setItem("character",JSON.stringify({state:{...a,character:{...a.character,...r}},version:1}))};export{t as p};
