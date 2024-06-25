const { getPrimeNumberWithinRange, otherRequest } = require("./test");



setInterval(()=>{
    otherRequest()
    console.log("calc prime number 10 ... 100");
    getPrimeNumberWithinRange(10,10000)
    otherRequest()
},1000)
