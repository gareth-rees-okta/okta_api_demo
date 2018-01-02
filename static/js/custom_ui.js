var baseUrl = 'https://' + org;           //e.g. 'https://zeekhoo.okta.com'
var issuer = baseUrl + '/oauth2/' + iss;  //e.g. https://zeekhoo.okta.com/oauth2/ausxkcyonq9Ht1uvi1t6'
var client_a = aud;                       //e.g. 'zXkxpyie6BCcutIWnk3B'

var client_b = '0oa4ox4jzjHj9vWgR1t7';
var client_id = client_a;
var redirect_uri = 'http://localhost:8000/oauth2/postback';


function do_login(un, pw) {
    var config = {
        url: baseUrl,
        clientId: client_id,
        redirectUri: redirect_uri,
        issuer: issuer,
    };
    var authClient = new OktaAuth(config);

    authClient.signIn({
        username: un,
        password: pw
    })
    .then(function(transaction) {
        if (transaction.status === 'SUCCESS') {
            // Step #1: get sessionToken
            console.log('sessionToken = ', transaction.sessionToken);

            // Step #2: retrieving a session cookie via OpenID Connect Authorization Endpoint
            // Requires the user be authenticated already (i.e. the transaction.sessionToken exists. See Step #1)
            // Uses response_mode=form_post: This will POST authorization_code and state to the redirectUri
            authClient.token.getWithRedirect({
                responseType: 'code',
                responseMode: 'form_post',
                sessionToken: transaction.sessionToken,
                scopes: [
                    'openid', 'profile', 'email', 'address', 'phone',
                    'com.zeek.p1.resource1.admin',
                    'com.zeek.p1.resource1.user'
                ],
                //state state param to client_id so that the server knows which app we are hitting...
                state: client_id,
            });
        } else {
            throw 'We cannot handle the ' + transaction.status + ' status';
        }
    })
    .fail(function(err) {
        console.error(err);
    });
}

