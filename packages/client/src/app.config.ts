const protocol = window.location.protocol;
const serverBaseUrl = window.location.hostname;

export const appConfig = {
  api: {
    protocol,
    baseUrl: serverBaseUrl,
    port: 3100,
  },
  webSocket: {
    protocol,
    baseUrl: serverBaseUrl,
    port: 3000,
  }
}
