const getPrimeNumberWithinRange = async (start, end, chunkSize = 10) => {
    let arr = [];
    for (let i = start; i <= end; i += chunkSize) {
        await new Promise((resolve) => setTimeout(resolve, 0)); 
        for (let j = i; j < i + chunkSize && j <= end; j++) {
            if (isPrime(j)) {
                arr.push(j);
            }
        }
    }
    console.log("prime numbers: " + arr);
    return arr;
}

const isPrime = (n) => {
    if (n < 2) return false; 
    for (let i = 2; i <= n/2; i++) { 
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}
const otherRequest = ()=>{
    console.log("other request...");
}
module.exports = {
    getPrimeNumberWithinRange,
    otherRequest
}
