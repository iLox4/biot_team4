/* eslint-disable */
const addRecordDtoInType = array(shape({
    _id: mongoId().isRequired(),
    datetime: datetime().isRequired(),
    temperature: number(-100, 100).isRequired(),
    humidity: number(0, 100).isRequired(),
}));

const removeRecordDtoInType = shape({
    ids: array(mongoId()).isRequired(),
});
