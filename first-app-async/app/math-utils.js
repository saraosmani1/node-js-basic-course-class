function getPrimeNumbersWithinRange(from,to) {
    const primes = [];
    for (let i = from; i <= to; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }

    return primes;
}

function isPrime(n) {
    for (let i = 2; i < n; i++) {
        if (n % i === 0) {
            // console.log(`${n} divisible by: `, i);
            return false;
        }
        // console.log(`${n} not divisible by: `, i);
    }

    return true;
}

module.exports.getPrimeNumbersWithinRange = getPrimeNumbersWithinRange;
module.exports.isPrime = isPrime;

