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
        /* 'Content-Length': Buffer.byteLength(data) */
    }
};

app.get('/', (req, res) => {
    res.send('OK working')
})

function remove_duplicate_elements(arr)
{

if (arr.length==0 || arr.length==1)
return arr.length;

/* let x = arr.length */
let temp=[];

let j = 0;
let i;
for ( i=0; i<arr.length; i++)
if (arr[i] != arr[i+1])
temp[j++] = arr[i];
temp[j++] = arr[arr.length-1];

for (i=0; i<j; i++)
arr[i] = temp[i];

return arr;
}

function mSort (array) {
    if (array.length === 1) {
    return array                            // return once we hit an array with a single item
 }
 const middle = Math.floor(array.length / 2) // get the middle item of the array rounded down
 const left = array.slice(0, middle)         // items on the left side
 const right = array.slice(middle)           // items on the right side
/*  document.write(middle); */
 return mergeSort(
    mSort(left),
    mSort(right)
 )
 }

function mergeSort (left, right) {
    let result = []
    let leftIndex = 0
    let rightIndex = 0
    while (leftIndex < left.length && rightIndex < right.length) {
       if (left[leftIndex] < right[rightIndex]) {
       result.push(left[leftIndex])
       leftIndex++
       /* document.write("</br>");    */     
       } else {
       result.push(right[rightIndex])
       rightIndex++      
    }
 }
 return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
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
                /* response.on('data', (chunk) => {
                    data += chunk;
                    console.log('data====',data.numbers)
                }); */
            /* console.log('data',JSON.parse(data).numbers) */
        })
        }
        catch(err){
            console.log(err)
        }
        

        /* await http.get(`http://localhost:8090/${options.path}`, (resp) => {
            let data = '';

            
            resp.on('data', (chunk) => {
                data += chunk;
                console.log('data====',data.numbers)
            });

        
            resp.on('end', () => {
                for(let i of JSON.parse(data).numbers){
                    theArr.push(i)
                    console.log(i)
                }
                
                console.log('data',JSON.parse(data).numbers)
                
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        }); */

    }
    console.log('theArr', theArr);
    console.log(await remove_duplicate_elements(theArr));
    console.log('sorted',mSort(theArr));
    res.send('received');
})

app.listen(PORT, () => {
    console.log(`server started on port http://localhost:${PORT}`)
})