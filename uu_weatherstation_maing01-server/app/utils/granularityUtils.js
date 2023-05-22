const granularities = {
    "5m": 5 * 60,
    "10m": 10 * 60,
    "15m": 15 * 60,
    "30m": 30 * 60,
    "1h": 1 * 60 * 60,
    "12h": 12 * 60 * 60,
    "1d": 24 * 60 * 60,
};

const BASE_GRANULARITY = granularities['10m'];

// PROD
const olderRecordsGranularities = {
    0: BASE_GRANULARITY,
    [1 * 31 * 24 * 60 * 60]: granularities['30m'],
    [3 * 31 * 24 * 60 * 60]: granularities['1h'],
    [6 * 31 * 24 * 60 * 60]: granularities['12h'],
    [12 * 31 * 24 * 60 * 60]: granularities['1d'],
}

// DEV
// const olderRecordsGranularities = {
//     0: BASE_GRANULARITY,
//     [1 * 24 * 60 * 60]: granularities['1h'],
//     [3 * 24 * 60 * 60]: granularities['12h'],
//     [5 * 24 * 60 * 60]: granularities['1d'],
// }

const MAX_POINTS = 1000;

/*
 * Private function to get granularity validation error. If no errors, return false;
 *
 * @param {string} granularity - Granularity string ("10m", "30m", ...)
 * @param {ISOString} startDate - Time interal start
 * @param {ISOString} endDate - Time interal end
 * @return {string | boolean} 'shouldBeIncreased' | 'shouldBeDescreased' | false
*/
const _validateGranularity = (granularity, startDate, endDate) => {
    const interval = getGranularityInterval(granularity);
    const numberOfDataPoints = Math.ceil((new Date(endDate) - new Date(startDate)) / (interval * 1000));
    const datesInterval = new Date(endDate) - new Date(startDate);
    if (numberOfDataPoints > MAX_POINTS) return 'shouldBeIncreased';
    if ((interval * 1000) > datesInterval) return 'shouldBeDescreased';
    return false;
}

/*
 * Check if granularity is possible based on time interval.
 *
 * @param {string} granularity - Granularity string ("10m", "30m", ...)
 * @param {ISOString} startDate - Time interal start
 * @param {ISOString} endDate - Time interal end
 * @return {boolean} True if granularity is possible, othervise False
*/
const isGranularityPossible = (granularity, startDate, endDate) => {
    const granularityError = _validateGranularity(granularity, startDate, endDate);
    return !granularityError;
}

/*
 * Get list of possible granularities based on time interval.
 *
 * @param {ISOString} startDate - Time interal start
 * @param {ISOString} endDate - Time interal end
 * @return {string[]} Possible granularities strings (["10m", "30m", ...])
*/
const getPossibleGranularitiesList = (startDate, endDate) => {
    return Object.keys(granularities).filter((g) => isGranularityPossible(g, startDate, endDate))
}

/*
 * Get interval in seconds based on granularity string.
 *
 * @param {string} granularity - Granularity string ("10m", "30m", ...)
 * @return {number} Time interval in seconds
*/
const getGranularityInterval = (granularity) => {
    return granularities[granularity];
}

/*
 * Granularity string validation based on time interval. If granularity is not valid, closes valid granularity is returned.
 *
 * @param {string} granularity - Granularity string ("10m", "30m", ...)
 * @param {ISOString} startDate - Time interal start
 * @param {ISOString} endDate - Time interal end
 * @return {string} Valid granularity string ("10m", "30m", ...)
*/
const validateGranularity = (granularity, startDate, endDate) => {
    const granularityError = _validateGranularity(granularity, startDate, endDate);
    if (!granularityError) return granularity;

    const possibleGranularities = getPossibleGranularitiesList(startDate, endDate);
    if (granularityError === 'shouldBeIncreased') return possibleGranularities[0];
    else return possibleGranularities[possibleGranularities.length - 1];
}

/*
 * Get time interval to include at least two records.
 *
 * @param {ISOString} startDate - Time interal start
 * @param {ISOString} endDate - Time interal end
 * @return {[Date, Date]} Safe time interval
*/
const getSafeTimeInterval = (startDate, endDate) => {
    let startSafeInterval = 0;
    let endSafeInterval = 0;
    Object.entries(olderRecordsGranularities).map(([time, granularityInterval]) => {
        const intervalStart = Date.now() - time * 1000;
        if (new Date(startDate) < intervalStart) startSafeInterval = granularityInterval * 1000;
        if (new Date(endDate) < intervalStart) endSafeInterval = granularityInterval * 1000;
    })

    return [(+new Date(startDate) - startSafeInterval), (+new Date(endDate) + endSafeInterval)];
}

module.exports = { granularities, olderRecordsGranularities, BASE_GRANULARITY, getGranularityInterval, getPossibleGranularitiesList, validateGranularity, getSafeTimeInterval }
