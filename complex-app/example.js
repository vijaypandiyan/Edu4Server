const fs = require('fs')
let promise = new Promise(function(resolve, reject) {
    let data = fs.readFileSync('input.txt')
    console.log(data)
    if(data) {
        resolve({dataObj : data})
    } else {
        reject({dataObj : data})
    }
})

promise.then((data) => {
    console.log(data)
}).catch((e) => {
    console.log(e)
})