export class StakeAPI {
    constructor(url, cf_clearance, user_agent) {
      this.connected = false;
      this.checkConnectionInterval = null;
      this.latestCrashResults = null;
      this.initialSubscription = true;
      this.socket = new WebSocket(url, ['graphql-transport-ws'], {
        headers: {
          'User-Agent': user_agent,
          'Cookie': `cf_clearance:${cf_clearance}`,
          'Origin': 'https://stake.com'
        }
      });
      this.socket.addEventListener('open', () => {
        console.log('[Stake] Connected. Waiting for messages from WebSocket...');
        const payload = {
          "type": "connection_init",
          "payload": {
              "accessToken": "169ce009b6954f833d994e1cbd525e0964bfad72567902e922f4e70c20f1f3b049d7f8384dd0e9589da1bd8f3723d348",
              "language": "en",
              "lockdownToken": "s5MNWtjTM5TvCMkAzxov"
          }
        };
        this.socket.send(JSON.stringify(payload));
      });

      this.socket.addEventListener('message', (event) => {
        if (initialSubscription) {
          console.log('[Stake] Subscribed to Crash. Waiting for results...');
          initialSubscription = false;
          const payload = {
              "id": "da3cb1ee-2b56-4f35-ba19-b3b4f66f7cad",
              "type": "subscribe",
              "payload": {
                  "query": "subscription Crash {\n  crash {\n    event {\n      ... on MultiplayerCrash {\n        ...MultiplayerCrash\n      }\n      ... on MultiplayerCrashBet {\n        ...MultiplayerCrashBet\n      }\n      __typename\n    }\n  }\n}\n\nfragment MultiplayerCrash on MultiplayerCrash {\n  id\n  status\n  multiplier\n  startTime\n  nextRoundIn\n  crashpoint\n  elapsed\n  timestamp\n  cashedIn {\n    id\n    user {\n      id\n      name\n      preferenceHideBets\n    }\n    payoutMultiplier\n    gameId\n    amount\n    payout\n    currency\n    result\n    updatedAt\n    cashoutAt\n    btcAmount: amount(currency: btc)\n  }\n  cashedOut {\n    id\n    user {\n      id\n      name\n      preferenceHideBets\n    }\n    payoutMultiplier\n    gameId\n    amount\n    payout\n    currency\n    result\n    updatedAt\n    cashoutAt\n    btcAmount: amount(currency: btc)\n  }\n}\n\nfragment MultiplayerCrashBet on MultiplayerCrashBet {\n  id\n  user {\n    id\n    name\n    preferenceHideBets\n  }\n  payoutMultiplier\n  gameId\n  amount\n  payout\n  currency\n  result\n  updatedAt\n  cashoutAt\n  btcAmount: amount(currency: btc)\n}\n"
              }
          };
        }
      });

      this.socket.addEventListener('close', () => {
        console.log('[Stake] Disconnected');
      });

      this.socket.addEventListener('error', (event) => {
        console.log(event);
      });
    }

    async connect() {
      console.log('Attempting to connect');
    
      try {
        const json_data = {
          "query": "query CrashGameInitAuth {\n  crashGame {\n    ...MultiplayerCrash\n    leaderboard {\n      ...MultiplayerCrashBet\n    }\n  }\n  crashGameList {\n    ...MultiplayerCrash\n  }\n  user {\n    id\n    activeCrashBet {\n      ...MultiplayerCrashBet\n    }\n  }\n}\n\nfragment MultiplayerCrash on MultiplayerCrash {\n  id\n  status\n  multiplier\n  startTime\n  nextRoundIn\n  crashpoint\n  elapsed\n  timestamp\n  cashedIn {\n    id\n    user {\n      id\n      name\n      preferenceHideBets\n    }\n    payoutMultiplier\n    gameId\n    amount\n    payout\n    currency\n    result\n    updatedAt\n    cashoutAt\n    btcAmount: amount(currency: btc)\n  }\n  cashedOut {\n    id\n    user {\n      id\n      name\n      preferenceHideBets\n    }\n    payoutMultiplier\n    gameId\n    amount\n    payout\n    currency\n    result\n    updatedAt\n    cashoutAt\n    btcAmount: amount(currency: btc)\n  }\n}\n\nfragment MultiplayerCrashBet on MultiplayerCrashBet {\n  id\n  user {\n    id\n    name\n    preferenceHideBets\n  }\n  payoutMultiplier\n  gameId\n  amount\n  payout\n  currency\n  result\n  updatedAt\n  cashoutAt\n  btcAmount: amount(currency: btc)\n}\n",
          "variables": {}
      }
    
        const response = await axios.post(THIS.URL, json_data);
        if (response.status === 200 && response.data.data && response.data.data.crashGameList.length) {
          console.log('Connected to Stake API');
          this.connected = true;
          return true;
        } else {
          console.log('Failed to connect to Stake API');
          this.connected = false;
          this.stopConnectionChecker();
          return false;
        }
      } catch (err) {
        console.log('Failed to connect to Stake API', err);
        this.connected = false;
        this.stopConnectionChecker();
        return false;
      }
    }

    startConnectionChecker(onResponse, onStatusChange) {
      this.checkConnectionInterval = setInterval(async () => {
        try {
          const json_data = {
            'query': 'query CrashGameListHistory($limit: Int, $offset: Int) {\n  crashGameList(limit: $limit, offset: $offset) {\n    id\n    startTime\n    crashpoint\n    hash {\n      id\n      hash\n      __typename\n    }\n    __typename\n  }\n}\n',
            'operationName': 'CrashGameListHistory',
            'variables': {},
          };
          const response = await this.session.post(THIS.URL, json_data);
          if (response.status === 200 && response.data.data && response.data.data.crashGameList.length) {
            // console.log('Still connected to Stake API');
            onResponse(response.data.data.crashGameList[0]);
            onStatusChange(true); // Connection is maintained, update status to true
          } else {
            console.log('Connection lost to Stake API');
            this.connected = false;
            this.stopConnectionChecker();
            // Attempt to reconnect after a delay
            setTimeout(() => {
              this.connect().then((connected) => {
                if (connected) {
                  console.log('Reconnected to Stake API');
                  this.startConnectionChecker(onResponse, onStatusChange);
                  onStatusChange(true); // Successfully reconnected, update status to true
                } else {
                  console.log('Failed to reconnect to Stake API');
                  onStatusChange(false); // Failed to reconnect, update status to false
                  // Attempt to reconnect again after a delay
                  setTimeout(() => {
                    this.startConnectionChecker(onResponse, onStatusChange);
                  }, 5000); // Wait 5 seconds before attempting to reconnect again
                }
              });
            }, 5000); // Wait 5 seconds before attempting to reconnect
          }
        } catch (err) {
          console.log('Connection lost to Stake API', err);
          this.connected = false;
          onStatusChange(false); // Connection is lost, update status to false
          this.stopConnectionChecker();
          // Attempt to reconnect after a delay
          setTimeout(() => {
            this.connect().then((connected) => {
              if (connected) {
                console.log('Reconnected to Stake API');
                this.startConnectionChecker(onResponse, onStatusChange);
                onStatusChange(true); // Successfully reconnected, update status to true
              } else {
                console.log('Failed to reconnect to Stake API');
                onStatusChange(false); // Failed to reconnect, update status to false
                // Attempt to reconnect again after a delay
                setTimeout(() => {
                  this.startConnectionChecker(onResponse, onStatusChange);
                }, 5000); // Wait 5 seconds before attempting to reconnect again
              }
            });
          }, 5000); // Wait 5 seconds before attempting to reconnect
        }
      }, 10000); // Check connection every 10 seconds
    }

    stopConnectionChecker() {
      clearInterval(this.checkConnectionInterval);
      this.checkConnectionInterval = null;
    }

    async disconnect() {
      console.log('Disconnecting from Stake API');
      this.connected = false;
      clearInterval(this.checkConnectionInterval);
    }
    

    async user_balances() {
        const json_data = {
        'query': 'query UserBalances {\n  user {\n    id\n    balances {\n      available {\n        amount\n        currency\n        __typename\n      }\n      vault {\n        amount\n        currency\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        'operationName': 'UserBalances',
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async currency_conversion_rate() {
        const json_data = {
            'query': 'query CurrencyConversionRate {\n  info {\n    currencies {\n      name\n      eur: value(fiatCurrency: eur)\n      jpy: value(fiatCurrency: jpy)\n      usd: value(fiatCurrency: usd)\n      brl: value(fiatCurrency: brl)\n      cad: value(fiatCurrency: cad)\n      cny: value(fiatCurrency: cny)\n      idr: value(fiatCurrency: idr)\n      inr: value(fiatCurrency: inr)\n      krw: value(fiatCurrency: krw)\n      php: value(fiatCurrency: php)\n      rub: value(fiatCurrency: rub)\n      mxn: value(fiatCurrency: mxn)\n      dkk: value(fiatCurrency: dkk)\n    }\n  }\n}\n',
            'variables': {}
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async user_kyc_info() {
        const json_data = {
          'query': `query UserKycInfo {
            isDiscontinuedBlocked
            user {
              id
              roles {
                name
                __typename
              }
              kycStatus
              dob
              createdAt
              isKycBasicRequired
              isKycExtendedRequired
              isKycFullRequired
              isKycUltimateRequired
              hasEmailVerified
              phoneNumber
              hasPhoneNumberVerified
              email
              registeredWithVpn
              isBanned
              isSuspended
              kycBasic {
                ...UserKycBasic
                __typename
              }
              kycExtended {
                ...UserKycExtended
                __typename
              }
              kycFull {
                ...UserKycFull
                __typename
              }
              kycUltimate {
                ...UserKycUltimate
                __typename
              }
              veriffStatus
              jpyAlternateName: cashierAlternateName(currency: jpy) {
                firstName
                lastName
                __typename
              }
              nationalId
              outstandingWagerAmount {
                currency
                amount
                progress
                __typename
              }
              activeRollovers {
                id
                active
                user {
                  id
                  __typename
                }
                amount
                lossAmount
                createdAt
                note
                currency
                expectedAmount
                expectedAmountMin
                progress
                activeBets {
                  id
                  iid
                  game {
                    id
                    slug
                    name
                    __typename
                  }
                  bet {
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
          }
          fragment UserKycBasic on UserKycBasic {
            active
            address
            birthday
            city
            country
            createdAt
            firstName
            id
            lastName
            phoneNumber
            rejectedReason
            status
            updatedAt
            zipCode
            occupation
          }
          fragment UserKycExtended on UserKycExtended {
            id
            active
            createdAt
            id
            rejectedReason
            status
          }
          fragment UserKycFull on UserKycFull {
            active
            createdAt
            id
            rejectedReason
            status
          }
          fragment UserKycUltimate on UserKycUltimate {
            id
            active
            createdAt
            id
            rejectedReason
            status
          }`,
          'operationName': 'UserKycInfo',
        };
      
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async send_tip_meta(name) {
        const json_data = {
            "query": `query SendTipMeta($name: String) {
            user(name: $name) {
                id
                name
                __typename
            }
            self: user {
                id
                hasTfaEnabled
                isTfaSessionValid
                balances {
                available {
                    amount
                    currency
                    __typename
                }
                vault {
                    amount
                    currency
                    __typename
                }
                __typename
                }
                __typename
            }
            }`,
            "operationName": "SendTipMeta",
            "variables": {}
        };
        if (name) {
            json_data['variables']['name'] = name;
        }
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async tip_limit(currency) {
        const json_data = {
            'query': `query TipLimit($currency: CurrencyEnum!) {
            info {
                currency(currency: $currency) {
                tipMin {
                    value
                    __typename
                }
                __typename
                }
                __typename
            }
            }`,
            'operationName': 'TipLimit',
            'variables': {
            'currency': currency,
            },
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async send_tip(user_id, amount, currency, is_public = true, tfa_token = null) {
        const json_data = {
            'query': 'mutation SendTip($userId: String!, $amount: Float!, $currency: CurrencyEnum!, $isPublic: Boolean, $chatId: String!, $tfaToken: String) {\n  sendTip(\n    userId: $userId\n    amount: $amount\n    currency: $currency\n    isPublic: $isPublic\n    chatId: $chatId\n    tfaToken: $tfaToken\n  ) {\n    id\n    amount\n    currency\n    user {\n      id\n      name\n      __typename\n    }\n    sendBy {\n      id\n      name\n      balances {\n        available {\n          amount\n          currency\n          __typename\n        }\n        vault {\n          amount\n          currency\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
            'operationName': 'SendTip',
            'variables': {
            'userId': user_id,
            'amount': amount,
            'currency': currency,
            'isPublic': is_public,
            'chatId': 'c65b4f32-0001-4e1d-9cd6-e4b3538b43ae'
            }
        };
        if (tfa_token) {
            json_data.variables.tfaToken = tfa_token;
        }
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async user_phone_meta() {
        const json_data = {
          'query': `query UserPhoneMeta {
            user {
              ...UserPhoneFragment
              __typename
            }
          }
      
          fragment UserPhoneFragment on User {
            id
            phoneNumber
            phoneCountryCode
            hasPhoneNumberVerified
          }
          `,
          'operationName': 'UserPhoneMeta',
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
    }

    async user_email_meta() {
        const json_data = {
          'query': `query UserEmailMeta {\n  user {\n    ...UserEmailFragment\n  }\n}\n\nfragment UserEmailFragment on User {\n  id\n  email\n  hasEmailVerified\n  hasEmailSubscribed\n}\n`,
          'variables': {},
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
      }
      
      async session_list(offset=0, limit=10, name=null) {
        const json_data = {
          'query': `query SessionList($offset: Int = 0, $limit: Int = 10, $name: String) {\n  user(name: $name) {\n    id\n    sessionList(offset: $offset, limit: $limit) {\n      ...UserSession\n    }\n  }\n}\n\nfragment UserSession on UserSession {\n  id\n  sessionName\n  ip\n  country\n  city\n  active\n  updatedAt\n}\n`,
          'variables': {
            'offset': 0,
            'limit': 10,
          },
        };
        if (name) {
          json_data['variables']['name'] = name;
        }
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
      }
      
      async user_community_preferences() {
        const json_data = {
          'query': `query UserCommunityPreferences {\n  user {\n    id\n    community {\n      preferences {\n        rainExclude\n      }\n    }\n  }\n}\n`,
          'variables': {},
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.data;
      }
      
      async create_withdrawal_meta() {
        const json_data = {
          'query': `query CreateWithdrawalMeta {\n  user {\n    id\n    hasTfaEnabled\n    balances {\n      ...UserBalanceFragment\n      __typename\n    }\n    __typename\n  }\n  info {\n    currencies {\n      name\n      withdrawalFee {\n        value\n        __typename\n      }\n      withdrawalMin {\n        value\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment UserBalanceFragment on UserBalance {\n  available {\n    amount\n    currency\n    __typename\n  }\n  vault {\n    amount\n    currency\n    __typename\n  }\n}\n`,
          'operationName': 'CreateWithdrawalMeta',
        };
        const response = await this.session.post(THIS.URL, json_data);
        return response.json();
      }

      async createWithdrawal(currency, address, amount, chain = null, email_code = null, tfa_token = null, oauth_token = null) {
        const json_data = {
          'query': `mutation CreateWithdrawal($chain: CryptoChainEnum, $currency: CryptoCurrencyEnum!, $address: String!, $amount: Float!, $emailCode: String, $tfaToken: String, $oauthToken: String) {
            createWithdrawal(
              chain: $chain
              currency: $currency
              address: $address
              amount: $amount
              emailCode: $emailCode
              tfaToken: $tfaToken
              oauthToken: $oauthToken
            ) {
              id
              __typename
            }
          }`,
          'operationName': 'CreateWithdrawal',
          'variables': {
            currency,
            address,
            amount,
          },
        };
        if (chain) {
          json_data.variables.chain = chain;
        }
        if (email_code) {
          json_data.variables.emailCode = email_code;
        }
        if (tfa_token) {
          json_data.variables.tfaToken = tfa_token;
        }
        if (oauth_token) {
          json_data.variables.oauthToken = oauth_token;
        }
        const response = await this.session.post(THIS.URL, json_data);
        return response.json();
      }

      async requestResults() {    
        if (!this.connected) {
          throw new Error('Not connected to Stake API');
        }  
        const json_data = {
          'query': 'query CrashGameListHistory($limit: Int, $offset: Int) {\n  crashGameList(limit: $limit, offset: $offset) {\n    id\n    startTime\n    crashpoint\n    hash {\n      id\n      hash\n      __typename\n    }\n    __typename\n  }\n}\n',
          'operationName': 'CrashGameListHistory',
          'variables': {},
        };
      
        return axios.post(THIS.URL, json_data)
          .then(response => {
            const res = response.data.data;
            return res;
            // return Object['data']['crashGameList'][0]['crashpoint'];
          })
          .catch(error => {
            if (error.code === 'ECONNABORTED') {
              return new Promise(resolve => setTimeout(() => resolve(requestResults()), 1000));
            } else {
              throw error;
            }
          });
      }
};