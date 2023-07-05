// local time format
const format = (
    date,
    options = {
        year: "numeric",
        month: "numeric",
        // weekday: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        hour12: false,
    }
) => new Intl.DateTimeFormat(undefined, options).format(date);

module.exports = format;
