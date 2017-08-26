chatapp.factory('Login', ['$resource', 'config', function($resource, config) {
    var loginUrl = config.apiUrl + 'api/login/';
    return $resource(
        loginUrl,
        {},
        {
            'query': {
                method: 'POST',
                data: {username: '@username', password: '@password'},
                headers: {
                    'Content-Type':'application/json'
                }
            }
        },
        {
            stripTrailingSlashes: false
        }
    );
}]);

chatapp.factory('GLogin', ['$resource', 'config', function($resource, config) {
    var gLoginUrl = config.apiUrl + 'api/glogin/';
    return $resource(
        gLoginUrl,
        {},
        {
            'save': {
                method : 'POST',
                data: {id_token: '@id_token'},
                headers: {
                    'Content-Type':'application/json'
                }
            }
        },
        {
            stripTrailingSlashes: false
        }
    );
}]);