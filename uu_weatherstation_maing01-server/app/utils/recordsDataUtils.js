const { BASE_GRANULARITY } = require("./granularityUtils");

function round(number, precision) {
    const helper = 10 ** precision;
    return parseInt(number * helper) / helper;
}
  
function upsampleRecordsData(data, outputFreq) {
    let outputData = [];
  
    for (let i = 0; i < data.length - 1; i++) {
        const time1 = new Date(data[i].datetime);
        const time2 = new Date(data[i + 1].datetime);
        const timeDiff = time2.getTime() - time1.getTime();
  
        // Nmber of output data points to be generated within this time interval
        const numOutputs = Math.floor(timeDiff / (outputFreq * 1000));
  
        // Calculate the data increment per output data point
        const tempIncrement = (data[i + 1].temperature - data[i].temperature) / numOutputs;
        const humIncrement = (data[i + 1].humidity - data[i].humidity) / numOutputs;
  
        // Loop through each output data point within this time interval and generate the temperature value using linear interpolation
        for (let j = 0; j < numOutputs; j++) {
            const timestamp = time1.getTime() + j * outputFreq * 1000;
            const temp = round(data[i].temperature + j * tempIncrement, 2);
            const hum = round(data[i].humidity + j * humIncrement, 2);
            outputData.push({ datetime: new Date(timestamp).toISOString(), temperature: temp, humidity: hum });
        }
    }
  
    // Add the last input data point to the output data
    const lastRecord = data[data.length - 1];
    outputData.push({ datetime: lastRecord.datetime, temperature: lastRecord.temperature, humidity: lastRecord.humidity });
  
    return outputData;
  }
  
  function downsampleRecordsData(data, outputFreq) {
    let outputData = [];
    let tempSum = 0;
    let numTemps = 0;
    let humSum = 0;
    let numHums = 0;
    let lastOutputTime = null;
    
    for (let i = 0; i < data.length; i++) {
        const time = new Date(data[i].datetime);
    
        // If this is the first data point, set the last output time to the input time
        if (lastOutputTime === null) {
            lastOutputTime = time;
        }
    
        // Add values to the sum and increment the count
        tempSum += data[i].temperature;
        numTemps++;
        humSum += data[i].humidity;
        numHums++;
    
        // If the time difference between the current input data point and the last output data 
        // point is greater than or equal to the desired output frequency, generate a new output data point
        const timeDiff = time.getTime() - lastOutputTime.getTime();
        if (timeDiff >= outputFreq * 1000) {
            const tempAvg = round(tempSum / numTemps, 2);
            const humAvg = round(humSum / numHums, 2);
            outputData.push({ datetime: lastOutputTime.toISOString(), temperature: tempAvg, humidity: humAvg });
            tempSum = 0;
            numTemps = 0;
            humSum = 0;
            numHums = 0;
            lastOutputTime = new Date(lastOutputTime.getTime() + outputFreq * 1000);
        }
    }
    
    // Add the last output data point (if any)
    if (numTemps > 0) {
        const tempAvg = round(tempSum / numTemps, 2);
        const humAvg = round(humSum / numHums, 2);
        outputData.push({ datetime: lastOutputTime.toISOString(), temperature: tempAvg, humidity: humAvg });
    }
    
    return outputData;
}

function sampleRecordsData(data, granularity) {
    // it's possible, that part of data array has bigger granularity, than 'granularity' param,
    // so even if 'granularity' is equal to BASE_GRANULARITY, we'll still upsample data
    if (granularity > BASE_GRANULARITY) return downsampleRecordsData(data, granularity);
    else if (granularity <= BASE_GRANULARITY) return upsampleRecordsData(data, granularity);
}

const inTimeInterval = (startDate, endDate) => (record) => {
    const isAfterStart = new Date(record.datetime) > new Date(dtoIn.startDate);
    const isBeforeEnd = new Date(record.datetime) < new Date(dtoIn.endDate);
    return isAfterStart && isBeforeEnd;
}

module.exports = { sampleRecordsData, inTimeInterval }
