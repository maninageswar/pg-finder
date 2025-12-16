export function preventKeyPress(e, blockedKeys) {
    if (blockedKeys.includes(e.key)) {
        e.preventDefault();
    }
}

export function listOfRents(property) {
    let pgRents = [];
    for (let i = 1; i <= 5; i++) {
        if (property[`sharing${i}Rent`]) {
            pgRents.push(property[`sharing${i}Rent`]);
        }
    }
    return pgRents;
}