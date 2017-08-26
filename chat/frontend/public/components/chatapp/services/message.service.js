chatapp.factory('Message', ['$resource', 'config', function($resource, config) {
    var messagesUrl = config.apiUrl + 'api/messages/:username/';
	return $resource(
		messagesUrl,
		{},
		{
			'query': {
				method : "GET",
				headers : {
					'Content-Type' : 'application/json'
				},
				isArray: true
			},
			'save': {
				method : "POST",
				headers : {
					'Content-Type' : 'application/json'
				}
			},
			'fsave': {
				method: "POST",
                headers: {
                    'Content-Type' : undefined,
                    enctype : 'multipart/form-data'
                },
                transformRequest: function (data) {
                    var fd = new FormData();
                    angular.forEach(data, function(value, key) {
                        if (value instanceof File)
                            fd.append(key, value);
                        else if (value !== null &&  typeof value === 'object'){
                            fd.append(key, JSON.stringify(value)); 
                        } 
                        else {
                            fd.append(key, value);
                        }
                    });
                    
                    return fd;
                },
			}
		},
		{
			stripTrailingSlashes: false
		}
    )
}]);

chatapp.factory('Conversation', ['$resource', 'config', function($resource, config) {
    var conversationsUrl = config.apiUrl + 'api/conversations/';
    return $resource(
        conversationsUrl,
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
    )
}]);

chatapp.factory('UpdateReadStatus', ['$resource', 'config', function($resource, config) {
    var updateReadStatusUrl = config.apiUrl + 'api/update_read_status/';
    return $resource(
        updateReadStatusUrl,
        {},
        {
            'update': {
                method : "PUT",
                headers : {
                    'Content-Type' : 'application/json'
                },
                isArray: false
            }
        },
        {
            stripTrailingSlashes: false
        }
    )
}]);