export const checkScopes = (payload: any, scopes: string[]): boolean => {
  return payload!.scope.some(scope => scopes.includes(scope));
};
