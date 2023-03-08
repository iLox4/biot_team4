/* eslint-disable */
const updateGatewayDtoInType = shape({
    id: mongoId().isRequired(),
    name: uu5String(512),
    state: oneOf(['created', 'active', 'closed']),
    location: shape({
        city: uu5String(512),
        street: uu5String(512),
        zip: uu5String(5, 5),
    }),
});

const removeGatewayDtoInType = shape({
    id: mongoId().isRequired(),
});

const getGatewayDtoInType = shape({
    id: mongoId().isRequired(),
});

const listGatewayDtoInType = shape({
  name: uu5String(512),
  location: uu5String(512),
  state: oneOf(['created', 'active', 'closed']),
  pageInfo: shape({
    pageIndex: number(),
    pageSize: number(),
  }),
});

const getGatewayRecordsDtoInType = shape({
    interval: array(uu5String(), 2, 2).isRequired(),
    granularity: oneOf(['1m', '5m', '15m', '30m', '1h', '12h', '1d']).isRequired(),
});