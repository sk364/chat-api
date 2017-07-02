myapp
	.factory('Message', function($resource) {
		return $resource(
			'http://localhost:8000/api/messages/:username/',
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
		);
	}
);