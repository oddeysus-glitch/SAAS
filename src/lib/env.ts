function isServer() {
  return typeof window === 'undefined';
}

export function getServerSideEnv(key: string): string {
  if (!isServer()) {
    throw new Error('getServerSideEnv must only be used on the server');
  }
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing server env: ${key}`);
  }
  return value;
}

export function getOptionalServerEnv(key: string): string | undefined {
  if (!isServer()) {
    throw new Error('getOptionalServerEnv must only be used on the server');
  }
  return process.env[key];
}
