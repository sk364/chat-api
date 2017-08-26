chatapp.factory('User', ['$resource', 'config', function($resource, config) {
    var usersUrl = config.apiUrl + 'api/users/';
    return $resource(
        usersUrl,
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
}]);