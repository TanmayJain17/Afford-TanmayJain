const express = require('express')
const axios = require('axios')
const app = express()
const http = require('http')
const PORT = process.env.PORT || 8080

var options = {
    host: 'localhost',
    port: 8090,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        
    }
};

app.get('/', (req, res) => {
    res.send('OK working')
})

async function removeDuplicates(arr)
{
    
    let n = arr.length
    if (n==0 || n==1)
        return n;
 
    let temp=[];
 
    
    let j = 0;
    for (let i=0; i<n-1; i++)
 
       
        if (arr[i] != arr[i+1])
            temp[j++] = arr[i];
 
    
    temp[j++] = arr[n-1];
 
    
    for (let i=0; i<j; i++)
        arr[i] = temp[i];
 
    return arr;
}

function merge(arr, l, m, r)
{
    var n1 = m - l + 1;
    var n2 = r - m;
  
   
    var L = new Array(n1); 
    var R = new Array(n2);
  
    
    for (var i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (var j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
  
   
    var i = 0;
  
    
    var j = 0;
  
    
    var k = l;
  
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
  
   
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
  
   
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    return arr
}
  

async function mergeSort(arr,l, r){
    if(l>=r){
        return;
    }
    var m =l+ parseInt((r-l)/2);
    mergeSort(arr,l,m);
    mergeSort(arr,m+1,r);
    return merge(arr,l,m,r);
}


app.get('/numbers', async (req, res) => {
    console.log(req.query.url);
    let urlArray = req.query.url
    urlArray = urlArray.filter(url => url.includes("http://localhost:8090"))
    console.log('urlArray',urlArray);
    let theArr =[]
    for (let i of urlArray) {
        console.log('i',i)
        const path = i.substring(22, i.length);
        options.path = path
        console.log(path)

        try{
            await axios.get(`http://localhost:8090/${options.path}`)
            .then((response) => {
                console.log(response.data.numbers)
                for(let i of response.data.numbers) {
                    theArr.push(i)
                }
               
        })
        }
        catch(err){
            console.log(err)
        }
        

        

    }
    console.log('theArr', theArr);
    theArr = await mergeSort(theArr, 0, theArr.length - 1)
    /* console.log('sorted',await mergeSort(theArr, 0, theArr.length - 1)); */
    theArr = await removeDuplicates(theArr)
    /* console.log(await removeDuplicates(theArr)); */
    res.send(theArr);
})

app.listen(PORT, () => {
    console.log(`server started on port http://localhost:${PORT}`)
})