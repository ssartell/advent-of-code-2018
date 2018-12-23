var input = 0;
var a,b,c,d;
a = b = c = d = 0;

do {
} while(123 & 72 !== 72)

var str = '[';

var seen = new Set();
var values = [];

while (true) {
    b = d | 0b10000000000000000;
    d = 521363;
    
    while (true) {
        c = b & 0b11111111;     // first byte of b
        d += c;
        d &= 0b111111111111111111111111;
        d *= 65899;             // times prime
        d &= 0b111111111111111111111111;
    
        if (256 > b) {
            // var bin = d.toString(2).padStart(24, '0');
            // var one = bin.substr(0, 8);
            // var two = bin.substr(8, 8);
            // var three = bin.substr(16, 8);
            //console.log(`${one} ${two} ${three}`);
            str += d.toString(16).padStart(6, '0') + ', ';
            if (seen.has(d)) {
                console.log(str + ']');
            } else {
                seen.add(d);
                values.push(d);
            }
            break;
        } else {
            b = Math.floor(b / 256);    // shift right a byte
        }
    }
}
