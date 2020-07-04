export const checkScopes = (payload: any, scopes: string[]): boolean => {
  return payload!.scope.some((scope: string) => scopes.includes(scope));
};
