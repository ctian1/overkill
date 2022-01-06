import util from 'util';

const { net, session } = window.require('electron').remote;
const { ipcRenderer } = require('electron');

class ValorantAPI {
  static request(key, method, url, headers, data) {
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

      if (result2.data.response === undefined) {
        throw Error('Login failed');
      }
      const reMatch = result2.data.response.parameters.uri.match(urlRegex);
      const accessToken = reMatch[1];
      const idToken = reMatch[2];
      const expiresIn = parseInt(reMatch[3], 10);

      const authHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
      const result3 = await this.request(key, 'POST', this.url('entitlements'), authHeaders, {});
      const entitlementsToken = result3.data.entitlements_token;

      authHeaders['X-Riot-Entitlements-JWT'] = entitlementsToken;

      await this.loadOffers(key, region, authHeaders);

      const result4 = await this.request(key, 'POST', this.url('userinfo'), authHeaders, {});

      const userID = result4.data.sub;

      const result5 = await this.request(key, 'PUT', ValorantAPI.url('playerId', region), authHeaders, [userID]);

      const riotID = `${result5.data[0].GameName}#${result5.data[0].TagLine}`;

      return {
        username,
        region,
        accessToken,
        idToken,
        expiresIn,
        entitlementsToken,
        userID,
        riotID,
      };
    }
    throw new Error();
  }

  static async loadNames() {
    if (ValorantAPI.names === null) {
      const res = await this.request('', 'GET', this.url('weapons'), {}, {});
      ValorantAPI.names = {};
      res.data.data.forEach((weapon) => {
        if (weapon.skins !== null) {
          weapon.skins.forEach((skin) => {
            ValorantAPI.names[skin.uuid] = skin.displayName;
            if (skin.levels !== null) {
              if (skin.levels[0] != null) {
                ValorantAPI.names[skin.levels[0].uuid] = skin.displayName;
              }
            }
          });
        }
      });
    }
  }

  static async loadOffers(key, region, authHeaders) {
    const res = await this.request(key, 'GET', this.url('offers', region), authHeaders, {});
    res.data.Offers.forEach((offer) => {
      if (offer.Cost[ValorantAPI.CURRENCIES.VP] !== null) {
        ValorantAPI.prices[offer.OfferID.toLowerCase()] = offer.Cost[ValorantAPI.CURRENCIES.VP];
      }
    });
  }

  static url(name, ...args) {
    return util.format(this.URLS[name], ...args);
  }
}

ValorantAPI.CURRENCIES = {
  VP: '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
  RP: 'e59aa87c-4cbf-517a-5983-6e81511be9b7',
  AGENTS: 'f08d4ae3-939c-4576-ab26-09ce1f23bb37',
};
ValorantAPI.BASE_URL = 'https://pd.%s.a.pvp.net';

ValorantAPI.URLS = {
  auth: 'https://auth.riotgames.com/api/v1/authorization',
  entitlements: 'https://entitlements.auth.riotgames.com/api/token/v1',
  userinfo: 'https://auth.riotgames.com/userinfo',
  storefront: `${ValorantAPI.BASE_URL}/store/v2/storefront/%s`,
  weapons: 'https://valorant-api.com/v1/weapons',
  offers: `${ValorantAPI.BASE_URL}/store/v1/offers`,
  playerId: `${ValorantAPI.BASE_URL}/name-service/v2/players`,
  wallet: `${ValorantAPI.BASE_URL}/store/v1/wallet/%s`,
  currencyIcon: 'https://media.valorant-api.com/currencies/%s/displayicon.png',
  skinIcon: 'https://media.valorant-api.com/weaponskinlevels/%s/displayicon.png',
};

ValorantAPI.names = null;
ValorantAPI.prices = {};

window.val = ValorantAPI;

export default ValorantAPI;
