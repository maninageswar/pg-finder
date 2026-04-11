export const PG_SKY_COLOR = "#0ea5e9e6";

export const amenities = {
    airConditioning: "air conditioning",
    biometricEntry: "biometric entry",
    cctvSurveillance: "cctv surveillance",
    commonKitchen: "common kitchen",
    commonTv: "common tv",
    cupboardWardrobe: "cupboard/wardrobe",
    geyserHotWater: "geyser/hot water",
    gymFitnessArea: "gym/fitness area",
    indoorGames: "indoor games",
    liftAvaliability: "lift/elevator",
    parkingSpace: "parking space",
    powerBackup: "power backup",
    refrigerator: "refrigerator",
    roWater: "ro water",
    roomCleaning: "room cleaning",
    studyTableChair: "study table & chair",
    threeMeals: "3 meals a day",
    washingMachines: "washing machines",
    wifi: "wi-fi"
};

export const states = [
        "andhra pradesh",
        "arunachal pradesh",
        "assam",
        "bihar",
        "chhattisgarh",
        "goa",
        "gujarat",
        "haryana",
        "himachal pradesh",
        "jharkhand",
        "karnataka",
        "kerala",
        "madhya pradesh",
        "maharashtra",
        "manipur",
        "meghalaya",
        "mizoram",
        "nagaland",
        "odisha",
        "punjab",
        "rajasthan",
        "sikkim",
        "tamil nadu",
        "telangana",
        "tripura",
        "uttar pradesh",
        "uttarakhand",
        "west bengal",
        "andaman and nicobar islands",
        "chandigarh",
        "dadra and nagar haveli and daman and diu",
        "delhi",
        "jammu and kashmir",
        "ladakh",
        "lakshadweep",
        "puducherry"
    ];

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

// place the funtions related to dates below
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

export function camelToSpaced(str) {
  return str.replace(/([A-Z])/g, ' $1').toLowerCase();
}