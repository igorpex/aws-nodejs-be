export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    id: { type: 'string' },
    count: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    imageurl: { type: 'string' },
  },
} as const;
