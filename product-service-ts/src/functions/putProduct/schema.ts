export default {
  type: "object",
  pathParameters: {
    productId: { type: 'string' },
  },
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    imageurl: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' },
  },
} as const;
