const mapping = {
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000,
};

// calculate diff  day-hour-minute-second
const calculateDiff = (diff) =>
    Object.entries(mapping).reduce((acc, [unit, period]) => {
        let unitDiff = Math.floor(diff / period);
        diff -= unitDiff * period;
        acc[unit] = unitDiff;
        return acc;
    }, {});

// time difference from now (ago)
function dateDiff(prev) {
    const prevTime = prev.getTime();
    const now = Date.now();

    if (prevTime === now) return;
    let diff = now - prevTime;
    const resultDiff = calculateDiff(diff);

    return resultDiff;
}

module.exports = dateDiff;
