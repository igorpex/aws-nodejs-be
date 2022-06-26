export default {
  type: "object",
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    imageurl: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' },
  },
} as const;
