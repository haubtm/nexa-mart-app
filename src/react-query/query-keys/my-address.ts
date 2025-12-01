export const myAddressKeys = {
  all: ['my-address'] as const,
  lists: () => [...myAddressKeys.all, 'list'] as const,
  detail: (id: string) => [...myAddressKeys.all, 'detail', id] as const,
};
