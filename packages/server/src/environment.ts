import * as fs from 'fs';

function parseBoolean(value): boolean {
  const truthybooleanRegex = /^(true|yes|1)$/i;
  const falsyBooleanRegex = /^(false|no|0)$/i;

  if (value === undefined || value === null) {
    return false;
  }
  if (truthybooleanRegex.test(value)) {
    return true;
  }
  if (falsyBooleanRegex.test(value)) {
    return false;
  }
  throw new Error(`Invalid boolean value: ${value}`);
}

const env = (varName: string) => {
  const value = process.env[varName];
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
  return value;
};

export const environment = {
  useHttps: parseBoolean(env('USE_HTTPS')),
  geminiApiKey: env('GEMINI_API_KEY'),
  webserverPort: parseInt(env('WEBSERVER_PORT')),
  websocketPort: parseInt(env('WEBSOCKET_PORT')),
  httpsOptions: {
    key: process.env.KEY_PATH
      ? fs.readFileSync(process.env.KEY_PATH)
      : undefined,
    cert: process.env.CERT_PATH
      ? fs.readFileSync(process.env.CERT_PATH)
      : undefined,
  },
};
