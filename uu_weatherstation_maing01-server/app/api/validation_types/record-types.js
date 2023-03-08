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