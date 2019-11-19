const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const encrypt = document.getElementById('encrypt');
const decrypt = document.getElementById('decrypt');
const generate = document.getElementById('generate');

generate.addEventListener('click', event => {
    event.preventDefault();

    const p = document.getElementById('p').value;
    const q = document.getElementById('q').value;
    const e = document.getElementById('e');
    const d = document.getElementById('d');

    if (checkKey(p, q)) {
        e.value = generateE(p, q);
        d.value = generateD(p, q, parseInt(e.value));
    }
})

encrypt.addEventListener('click', event => {
    event.preventDefault();

    const text = document.getElementById('text').value;
    const p = document.getElementById('p').value;
    const q = document.getElementById('q').value;
    const e = document.getElementById('e').value;

    const result = document.getElementById('result');

    if (checkKey(p, q) && text.trim() !== '') {
        result.value = encryptText(text, p, q, e);
        console.log(hash(text));
        result.value += `\n${createSign(hash(text), p, q, e)}`;
    }
});

decrypt.addEventListener('click', event => {
    event.preventDefault();

    const decryptedText = document.getElementById('text').value;
    const p = document.getElementById('p').value;
    const q = document.getElementById('q').value;
    const d = document.getElementById('d').value;

    const result = document.getElementById('result');

    if (checkKey(p, q) && decryptedText.trim() !== '') {
        const [text, sign] = decryptedText.split('\n');
        const encryptedText = decryptText(text, p, q, d);
        const textHash = hash(encryptedText);
        if (createSign(sign, p, q, d).value !== textHash.value) {
            result.value = 'Bad message';
        } else {
            result.value = encryptedText;
        }
    }
});

function encryptText(text, p, q, e) {
    const n = p * q;

    return text.split('').map(letter => {
        if (alphabet.indexOf(letter) !== -1) {
            const index = alphabet.indexOf(letter);
            return bigInt(index).pow(e).mod(n);
        }
    }).join(' ');
}

function decryptText(text, p, q, d) {
    const n = p * q;

    return text.split(' ').map(letter => {
        const position = bigInt(letter).pow(d).mod(n);
        return alphabet[position];
    }).join('');
}

function checkKey(p, q) {
    if (!isPrime(p) || !isPrime(q)) {
        alert('Keys must be prime numbers');
        return false;
    }

    return true;
}

function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
    return num > 1;
}

function generateE(p, q) {
    const fi = (p - 1) * (q - 1);
    for (let i = 2; i < fi; i++) {
        if (gcd(i, fi) === 1 && isPrime(i)) {
            return i;
        }
    }
}

function generateD(p, q, e) {
    const fi = (p - 1) * (q - 1);
    let d = p * q;
    while(((d * e) % fi) !== 1) {
        d--;
    }
    return d;
}

function gcd(x, y) {
    while (y !== 0) y = x % (x = y);
    return x;
}

function hash(text) {
    const calculated = text.split('').reduce((acc, letter) => {
        const letterIndex = alphabet.indexOf(letter);
        return acc + (letterIndex === -1 ? 25 : letterIndex);
    }, 0);

    return bigInt(calculated).mod(26);
}

function createSign(hash, p, q, key) {
    const n = p * q;
    return bigInt(hash).pow(key).mod(n);
}
