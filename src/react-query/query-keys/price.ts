export const priceKeys = {
  all: ['price'] as const,
  byProductIds: () => [...priceKeys.all, 'byProductId'] as const,
  byProductId: (id: number) => [...priceKeys.byProductIds(), id] as const,
};
