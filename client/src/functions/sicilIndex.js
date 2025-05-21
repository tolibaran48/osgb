const SicilIndex = (index) => {
    switch (index) {
        case 0:
            return { start: 0, hane: 1 }
        case 1:
            return { start: 2, hane: 4 }
        case 2:
            return { start: 7, hane: 2 }
        case 3:
            return { start: 10, hane: 2 }
        case 4:
            return { start: 13, hane: 7 }
        case 5:
            return { start: 21, hane: 3 }
        case 6:
            return { start: 25, hane: 2 }
        case 7:
            return { start: 28, hane: 2 }
        case 8:
            return { start: 31, hane: 3 }
        default:
            return { start: 0, hane: 1 };
    }
}

export default SicilIndex;