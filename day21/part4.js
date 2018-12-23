var input = 0;
var a,b,c,d;
a = b = c = d = 0;

do {
} while(123 & 72 !== 72)                    // number vs string check

while (true) {
    b = d | 0b10000000000000000;            // make last winner at least 24 bit?
    d = 521363;                             // start with prime number
    
    while (true) {
        c = b & 0b11111111;                 // mask first byte
        d += c;                             // add byte to d
        d &= 0b111111111111111111111111;    // mask 3 bytes
        d *= 65899;                         // multiply by prime number
        d &= 0b111111111111111111111111;    // mask 3 bytes
    
        if (256 > b) {                      // if no more bytes
            if (d === input) return;        // check if halt
            break;
        } else {
            b = Math.floor(b / 256);        // shift bytes right
        }
    }
}
