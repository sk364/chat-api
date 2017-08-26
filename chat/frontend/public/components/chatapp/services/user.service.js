chatapp.factory('User', function($resource) {
    return $resource(
        'http://localhost:8000/api/users/',
        {},
        {
            'query': {
                method : "GET",
                headers : {
                    'Content-Type' : 'application/json'
                },
                isArray: true
            }
        },
        {
            stripTrailingSlashes: false
        }
    );
});