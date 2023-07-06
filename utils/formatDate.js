function toLocaleStringSupportsLocales() {
    return (
        typeof Intl === "object" &&
        !!Intl &&
        typeof Intl.DateTimeFormat === "function"
    );
}

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
) => {
    if (toLocaleStringSupportsLocales()) {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        options.timeZone = userTimezone;
    }
    return date.toLocaleString(undefined, options);
};

module.exports = format;
