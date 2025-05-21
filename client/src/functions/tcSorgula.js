const tcNoSorgula = (TCNO) => {
    var tek = 0,
        cift = 0,
        sonuc = 0,
        TCToplam = 0

    if (TCNO.length !== 11) return false;
    if (isNaN(TCNO)) return false;
    if (parseInt(TCNO[0]) === 0) return false;

    tek = parseInt(TCNO[0]) + parseInt(TCNO[2]) + parseInt(TCNO[4]) + parseInt(TCNO[6]) + parseInt(TCNO[8]);
    cift = parseInt(TCNO[1]) + parseInt(TCNO[3]) + parseInt(TCNO[5]) + parseInt(TCNO[7]);

    tek = tek * 7;
    sonuc = Math.abs(tek - cift);
    if (sonuc % 10 !== parseInt(TCNO[9])) return false;

    for (let i = 0; i < 10; i++) {
        TCToplam += parseInt(TCNO[i]);
    }

    if (TCToplam % 10 !== parseInt(TCNO[10])) return false;

    return true;
}

module.exports = tcNoSorgula;