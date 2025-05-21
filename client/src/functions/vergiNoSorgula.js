
const vergiNoSorgula=(kno)=>{
    var v1 = 0;
    var v2 = 0;
    var v3 = 0;
    var v4 = 0;
    var v5 = 0;
    var v6 = 0;
    var v7 = 0;
    var v8 = 0;
    var v9 = 0;
    var v11 = 0;
    var v22 = 0;
    var v33 = 0;
    var v44 = 0;
    var v55 = 0;
    var v66 = 0;
    var v77 = 0;
    var v88 = 0;
    var v99 = 0;
    var v_last_digit = 0;
    var toplam = 0;

    if (kno.length === 10) {

        v1 = (Number(kno.charAt(0)) + 9) % 10;

        v2 = (Number(kno.charAt(1)) + 8) % 10;

        v3 = (Number(kno.charAt(2)) + 7) % 10;

        v4 = (Number(kno.charAt(3)) + 6) % 10;

        v5 = (Number(kno.charAt(4)) + 5) % 10;

        v6 = (Number(kno.charAt(5)) + 4) % 10;
        v7 = (Number(kno.charAt(6)) + 3) % 10;
        v8 = (Number(kno.charAt(7)) + 2) % 10;
        v9 = (Number(kno.charAt(8)) + 1) % 10;
        v_last_digit = Number(kno.charAt(9));

        v11 = (v1 * 512) % 9;
        v22 = (v2 * 256) % 9;
        v33 = (v3 * 128) % 9;
        v44 = (v4 * 64) % 9;
        v55 = (v5 * 32) % 9;
        v66 = (v6 * 16) % 9;
        v77 = (v7 * 8) % 9;
        v88 = (v8 * 4) % 9;
        v99 = (v9 * 2) % 9;

        if (v1 !== 0 && v11 === 0) v11 = 9;
        if (v2 !== 0 && v22 === 0) v22 = 9;
        if (v3 !== 0 && v33 === 0) v33 = 9;
        if (v4 !== 0 && v44 === 0) v44 = 9;
        if (v5 !== 0 && v55 === 0) v55 = 9;
        if (v6 !== 0 && v66 === 0) v66 = 9;
        if (v7 !== 0 && v77 === 0) v77 = 9;
        if (v8 !== 0 && v88 === 0) v88 = 9;
        if (v9 !== 0 && v99 === 0) v99 = 9;
        toplam = v11 + v22 + v33 + v44 + v55 + v66 + v77 + v88 + v99;


        if (toplam % 10 === 0) toplam = 0;
        else toplam = (10 - (toplam % 10));

        if (toplam === v_last_digit) {


            return true;
        } else return false;

    } else return false;
}

module.exports=vergiNoSorgula;