/* eslint-disable */
const { granularities } = require("../../../app/utils/granularityUtils");

const addRecordDtoInType = array(shape({
    _id: mongoId().isRequired(),
    datetime: datetime().isRequired(),
    temperature: number().isRequired(),
    humidity: number().isRequired(),
}));
  
const removeRecordDtoInType = shape({
    ids: array(mongoId()).isRequired(),
});

const getRecordsIntervalDtoInType = shape({
    gatewayId: mongoId().isRequired(),
    startDate: datetime().isRequired(),
    endDate: datetime().isRequired(),
    granularity: oneOf(Object.keys(granularities)).isRequired()
});