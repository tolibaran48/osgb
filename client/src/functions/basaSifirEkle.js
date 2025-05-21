const BasaSifirEkle = (number, width) => {
    return new Array(+width + 1 - (number + '').length).join('0') + number;
}

export default BasaSifirEkle;