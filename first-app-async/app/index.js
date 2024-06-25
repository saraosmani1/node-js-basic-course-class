const mathUtils = require("./math-utils");

// const response1 = request1(20);
// console.log("**response1**", response1);

otherRequests();
otherRequests2()
function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 1000);
}
console.log("end");
 function otherRequests2  () {
    setInterval( async() => {
        const result =  await request1(200000)
    console.log("**response1**",result);
    }, 1000);
}

async function request1(n) {
    console.log("**start request 1**");
    const start = new Date();

            const primes = await getPrimesAsync(2, n);

            const end = new Date();
            console.log("**finish request 1**. Elapsed ms: ", end.getTime() - start.getTime());

     return primes
}

async function getPrimesAsync(start, end) {
    const primes = [];
    let current = start;

    const chunkSize = 1000; 

    return new Promise((resolve) => {
        function processChunk() {
            const chunkEnd = Math.min(current + chunkSize, end);
            for (let i = current; i <= chunkEnd; i++) {
                if (mathUtils.isPrime(i)) primes.push(i);
            }
            current = chunkEnd + 1;

            if (current <= end) {
                setImmediate(processChunk);
            } else {
                resolve(primes);
            }
        }

        processChunk();
    });
}

