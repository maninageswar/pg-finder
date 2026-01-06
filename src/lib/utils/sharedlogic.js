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

// place the funtions related to dates logic them below
export function calculateDaysBetween(checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) {
        return 0; // Invalid dates or checkIn >= checkOut
    }
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
}

export function getRemainingDaysInMonth(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) {
        return 0; // Invalid date
    }
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const currentDay = date.getDate();
    return lastDayOfMonth - currentDay + 1;
}