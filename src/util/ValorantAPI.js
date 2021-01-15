import util from 'util';

const { net, session } = window.require('electron').remote;

class ValorantAPI {
  static async request(key, method, url, headers, data) {
    return new Promise((res, rej) => {
      const ses = session.fromPartition(key);
      const newHeaders = { 'Content-Type': 'application/json', ...headers };
      const req = net.request({
        method,
        headers: newHeaders,
        url,
        session: ses,
        useSessionCookies: true,
      });
      let body = '';
      req.on('response', (response) => {
        response.on('end', () => {
          const result = {
            data: JSON.parse(body),
            headers: response.headers,
            status: response.statusCode,
          };
          res(result);
        });

        response.on('error', (error) => {
          rej(error);
        });

        response.on('data', (chunk) => {
          body += chunk.toString();
        });
      });
      if (data) {
        const dataString = JSON.stringify(data);
        req.write(dataString);
      }
      req.end();
    });
  }

  static async login(username, password, region) {
    const data = {
      client_id: 'play-valorant-web-prod',
      nonce: '1',
      redirect_uri: 'https://playvalorant.com/opt_in',
      response_type: 'token id_token',
      scope: 'account openid',
    };

    const key = `${region}#${username}`;
    const ses = session.fromPartition(key);
    ses.clearStorageData();
    const result = await this.request(key, 'POST', this.URLS.auth, {}, data);
    if (result.data.type === 'auth') {
      const data2 = {
        type: 'auth',
        username,
        password,
      };
      const result2 = await this.request(key, 'PUT', this.URLS.auth, {}, data2);
      const urlRegex = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;

      const reMatch = result2.data.response.parameters.uri.match(urlRegex);
      const accessToken = reMatch[1];
      const idToken = reMatch[2];
      const expiresIn = reMatch[3];

      const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
      const result3 = await this.request(key, 'POST', this.URLS.entitlements, authHeaders, {});
      const entitlementsToken = result3.data.entitlements_token;

      authHeaders['X-Riot-Entitlements-JWT'] = entitlementsToken;

      const result4 = await this.request(key, 'POST', this.URLS.userinfo, authHeaders, {});
      return {
        username,
        region,
        accessToken,
        idToken,
        expiresIn,
        entitlementsToken,
        userId: result4.data.sub,
      };
    }
    throw new Error();
  }

  static url(name, ...args) {
    return util.format(this.URLS[name], ...args);
  }
}

ValorantAPI.URLS = {
  auth: 'https://auth.riotgames.com/api/v1/authorization',
  entitlements: 'https://entitlements.auth.riotgames.com/api/token/v1',
  userinfo: 'https://auth.riotgames.com/userinfo',
  storefront: 'https://pd.%s.a.pvp.net/store/v2/storefront/%s',
};

window.val = ValorantAPI;

export default ValorantAPI;
