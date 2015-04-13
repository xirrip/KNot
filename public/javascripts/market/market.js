/**
 * Created by xirri_000 on 4/13/2015.
 */

angular.module('market').controller('MarketController', ['$scope', function($scope) {

    function Market(args) {
        this.name = args.name;
        this.crestUrl = args.crestUrl;
        this.buyOrders = args.buyOrders;
        this.sellOrders = args.sellOrders;
    }

    $scope.selectedMarket;
    $scope.selectedItemGroup;
    $scope.selectedItem;

    var init = function(){
        $scope.selectedMarket = 'Rens';
        $scope.selectedItemGroup = 'Ships';
        $scope.selectedItem = 'Talwar';
    }

    init();

}]);

angular.module('market').controller('RegionsController', ['$scope', '$http', function($scope, $http) {
    $http.get('/data/regions').
        success(function(data, status, headers, config) {
            $scope.regions = data;
        }).
        error(function(data, status, headers, config) {
            // log error
        });
    $http.get('/data/groups').
        success(function(data, status, headers, config) {
            $scope.groups = data;
        }).
        error(function(data, status, headers, config) {
            // log error
        });

}]);

angular.module('market').controller('ItemGroupController', ['$scope', '$state', function($scope, $state) {
        var self = this;
        self.total = 0;
        self.root = {
            nodes: generate(5, "")
        };

        self.toggle = function(node) {
            if (!node.loaded) {
                node.nodes = generate(5, node.name);
                node.loaded = true;
            }
            node.expanded = !node.expanded;
        }

        function generate(count, parent) {
            var list = [];
            for (var i = 0; i < count; i++) {
                list.push({
                    nodes: [],
                    name: parent + "." + i,
                    expanded: false,
                    loaded: false
                });
            }
            self.total += count;

            return list;
        }
    }
]);



