const mathUtils = require("./math-utils");

const response1 = request1(20);
console.log("**response1**", response1);

otherRequests();

function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 50);
}

function request1(n) {
    console.log("**start request 1**");
    const start = new Date();

    const primes = mathUtils.getPrimeNumbersWithinRange(2, n);

    const end = new Date();
    console.log("**finish request 1**. Elapsed ms: ", end.getTime() - start.getTime());

    return primes;
}

