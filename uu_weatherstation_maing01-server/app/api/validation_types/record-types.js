/* eslint-disable */
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
    granularity: oneOf(['1m', '5m', '15m', '30m', '1h', '12h', '1d']).isRequired()
});