chatapp.factory('Login', function($resource) {
    return $resource(
        'http://localhost:8000/api/login/',
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
});

chatapp.factory('GLogin', function($resource) {
    return $resource(
        'http://localhost:8000/api/glogin/',
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
});