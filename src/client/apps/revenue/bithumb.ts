
import {CoinType, fetchJson, queryToStr} from './common';
import CryptoJS = require('crypto-js');

declare global {
    const escape;
}

function microtime(get_as_float?) {
	//  discuss at: http://phpjs.org/functions/microtime/
	// 	original by: Paulo Freitas
	//  example 1: timeStamp = microtime(true);
	//  example 1: timeStamp > 1000000000 && timeStamp < 2000000000
	//  returns 1: true

    const now = new Date().getTime() / 1000;
    const s = Math.floor(now);
    return (get_as_float) ? '' + now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function usecTime() {
    let rgMicrotime = microtime().split(' '),
        usec = rgMicrotime[0],
        sec = rgMicrotime[1];

    usec = usec.substr(2, 3);
    return Number(String(sec) + String(usec));
}

function privateCall<T>(endPoint: string, params) {
    const apiKey = getConnectKey();
    const secretKey = getSecretKey();
    params['endPoint'] = endPoint;
    const urlEncodedParams = queryToStr(params);
    // const nonce = usecTime();
    const nonce = Date.now();
    const str = endPoint + ';' + urlEncodedParams + ';' + nonce;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'api-client-type': '2',
        'Api-Key' : apiKey,
        'Api-Sign' : btoa(CryptoJS.HmacSHA512(str, secretKey).toString()),
        'Api-Nonce' : nonce,
        'User-Agent': 'test'
    });
    return fetchJson<T>(`/api/${endPoint}`, {
        method: 'POST',
        headers,
        body: urlEncodedParams,
    });
}

function http_build_query(obj) {
	const output_string = [];
	Object.keys(obj).forEach(function (val) {
        let key = val;
		key = encodeURIComponent(key.replace(/[!'()*]/g, escape));

		if (typeof obj[val] === 'object') {
			// var query = build_query(obj[val], null, key)
			// output_string.push(query)
		}
		else {
			let value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
			output_string.push(key + '=' + value);
		}
	});

	return output_string.join('&');
}

function base64_encode(data) {
	// discuss at: http://phpjs.org/functions/base64_encode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Bayron Guevara
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Rafał Kukawski (http://kukawski.pl)
	// bugfixed by: Pellentesque Malesuada
	// example 1: base64_encode('Kevin van Zonneveld');
	// returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	// example 2: base64_encode('a');
	// returns 2: 'YQ=='

	let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	ac = 0,
	enc = '',
	tmp_arr = [];

	if (!data) {
		return data;
	}

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	let r = data.length % 3;

	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

function chr(codePt) {
	//  discuss at: http://phpjs.org/functions/chr/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Brett Zamir (http://brett-zamir.me)
	//   example 1: chr(75) === 'K';
	//   example 1: chr(65536) === '\uD800\uDC00';
	//   returns 1: true
	//   returns 1: true

	if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
		//   enough for the UTF-16 encoding (JavaScript internal use), to
		//   require representation with two surrogates (reserved non-characters
		//   used for building other characters; the first is "high" and the next "low")
		codePt -= 0x10000;
		return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
	}
	return String.fromCharCode(codePt);
}

class XCoinAPI {

    private apiUrl: string;
    private api_key: string;
    private api_secret: string;
    constructor(api_key: string, api_secret: string) {
        // this.apiUrl = 'http://localhost:9000/https://api.bithumb.com';
        this.apiUrl = '/api';
        this.api_key = api_key;
        this.api_secret = api_secret;
    }

    xcoinApiCall(endPoint, params) {
        let rgParams: any = {
            'endPoint' : endPoint
        };

        if (params) {
            for (const o in params) {
                rgParams[o] = params[o];
            }
        }

        let api_host = this.apiUrl + endPoint;
        let httpHeaders = this._getHttpHeaders(endPoint, rgParams, this.api_key, this.api_secret);

        return this.request(api_host, 'POST', rgParams, httpHeaders);
    }

    request(strHost, strMethod, rgParams, httpHeaders) {
        console.log('request', httpHeaders, rgParams);
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        if (httpHeaders) {
            for (const key in httpHeaders) {
                headers.append(key, httpHeaders[key]);
            }
        }
        const formData = new FormData();
        for (const key in rgParams) {
            // formData.append(key, rgParams[key]);
            formData.append(key, encodeURIComponent(rgParams[key]));
        }

        // return new Promise(function(resolve, reject) {
        //     $.ajax({
        //         url: strHost,
        //         type: 'POST',
        //         headers: httpHeaders,
        //         data: http_build_query(rgParams),
        //         // data: JSON.stringify(rgParams),
        //         cache: false,
        //         processData: false,
        //         success: resolve,
        //         error: reject,
        //     });
        // });

        return fetchJson(strHost, {
                method : strMethod,
                headers,
                body: http_build_query(rgParams),
            }
        );

        // request({
        //         method : strMethod,
        //         uri : strHost,
        //         headers : rgHeaders,
        //         formData : rgParams
        //     },
        //     function(error, response, rgResult) {
        //         if(error) {
        //             console.log(error);
        //             return;
        //         }

        //         var rgResultDecode = JSON.parse(rgResult);
        //         io.sockets.emit('XCoinAPIResponse', rgResultDecode);
        //     }
        // );
    }


    _getHttpHeaders(endPoint, rgParams, api_key, api_secret) {
        let strData	= http_build_query(rgParams);
        let nNonce = this.usecTime();
        const str = endPoint + ';' + strData + ';' + nNonce;
        console.log('_getHttpHeaders', str, api_secret);
        return {
            'api-client-type': '2',
            'Api-Key' : api_key,
            // 'Api-Sign' : btoa(CryptoJS.HmacSHA512(endPoint + chr(0) + strData + chr(0) + nNonce, api_secret).toString()),
            'Api-Sign' : btoa(CryptoJS.HmacSHA512(str, api_secret).toString()),
            'Api-Nonce' : nNonce,
            'User-Agent': 'test'
        };
    }

    usecTime() {
        let rgMicrotime = microtime().split(' '),
            usec = rgMicrotime[0],
            sec = rgMicrotime[1];

        usec = usec.substr(2, 3);
        return Number(String(sec) + String(usec));
    }

}

export function getConnectKey() {
    return localStorage.getItem('connect_key');
}

export function getSecretKey() {
    return localStorage.getItem('secret_key');
}

interface RespCommon<T> {
    status: string;
    data: T[];
}

// https://api.bithumb.com/public/ticker/{currency}
const URL_TICKER = (type: CoinType) => `/api/public/ticker/${type}`;

export interface TickerResp {
    status: string;
    data: {
        opening_price: string;
        closing_price: string;
        min_price: string;
        max_price: string;
        average_price: string;
        units_traded: string;
        volume_1day: string;
        volume_7day: string;
        buy_price: string;
        sell_price: string;
        date: string;
    };
}


export async function getTicker(types: CoinType[], cb: (ret: TickerResp[]) => void) {
    cb(await Promise.all(types.map(t => fetchJson<TickerResp>(URL_TICKER(t)))));
    setTimeout(async function() {
        cb(await Promise.all(types.map(t => fetchJson<TickerResp>(URL_TICKER(t)))));
    }, 1000);
};

interface GetOrderInfoParams {
    order_id?: string;
    type?: string;
    count?: number;
    after?: number;
    currency?: CoinType;
}

interface GetOrderInfo {
    order_id: string;
    order_currency: string;
    order_date: number;
    payment_currency: string;
    type: 'bid' | 'ask';
    status: 'placed';
    units: string;
    units_remaining: string;
    price: string;
    fee: string;
    total: string;
    date_completed: number;
}

type GetOrderInfoResp = RespCommon<GetOrderInfo>;

export async function getOrderInfo() {
    const params: GetOrderInfoParams = {
    };
    return privateCall<GetOrderInfoResp>('/info/orders', params);
}

interface GetUserTransactionsParams {
    offset?: number;
    count?: number;
    searchGb?: string;
    currency?: CoinType;
}

export interface UserTransaction {
    search: string;
    transfer_date: string;
    units: string;
    price: string;
    btc1krw: string;
    fee: string;
    btc_remain: string;
    krw_remain: string;
}

type GetUserTransactionsResp = RespCommon<UserTransaction>;

export async function getUserTransactions(currency: CoinType = 'BTC') {
    const COUNT = 50;
    const params: GetUserTransactionsParams = {
        offset: 0,
        count: COUNT,
        searchGb: '0',
        currency,
    };
    let ret: UserTransaction[] = [];
    for (let count = COUNT; count === COUNT; ) {
        const transactions = await privateCall<GetUserTransactionsResp>('/info/user_transactions', params);
        ret = ret.concat(transactions.data);
        count = transactions.data.length;
        params.offset += count;
    }
    return ret;
}

export async function test() {
    let xcoinAPI = new XCoinAPI(getConnectKey(), getSecretKey());
    let rgParams = {
        currency: 'ALL',
    };
    const resp = await xcoinAPI.xcoinApiCall('/info/balance', rgParams);
    console.log('test', resp);
}

getOrderInfo();
getUserTransactions();
