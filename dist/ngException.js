(function() {
    'use strict';
    (angular.module('ngException', ['ng'])).factory('Exception', function($rootScope, $timeout, $interval) {
        return function(list, exceptionsMap) {
            
            var throwsException = {
                watchdog: undefined,
                exceptionsMap: exceptionsMap || {},
                handler: function(data) {
                    for (var ref in this.exceptionsMap) {
                        var re = new RegExp(ref);
                        if (re.exec(data.message)) {
                            data.message = this.exceptionsMap[re.exec(data.message)[0]];
                        }
                    }
                    console.error(data);
                    return data;
                },
                partCleaning: function(list) {
                    if (list.length > 0) {
                        list.splice(0, 1);
                    } else {
                        $interval.cancel(throwsException.watchdog);
                    }
                }
            };

            this.throws = function(e, sleep) {

                var error = new Error();
                if (e === null || e === undefined) {
                    error.message = 'No Service';
                    error.stack = '[No Service] Uncatalogued error';
                } else {
                    if (typeof e === 'string') {
                        error.message = e;
                        error.stack = e;
                    } else {
                        error.message = e.message;
                        error.stack = e.stack;
                    }
                }
                list.push(throwsException.handler(error));

                if(sleep){
                    $interval.cancel(throwsException.watchdog);
                    throwsException.watchdog = $interval(function() {
                        throwsException.partCleaning(list);
                    }, (sleep * 1000));
                }
            };
        };
    });

})(window, document);
