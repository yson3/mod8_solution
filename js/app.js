(function () {
'use strict';

angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('endpoint', 'https://davids-restaurant.herokuapp.com/menu_items.json')
  .directive('foundItems', FoundItemsDirective);


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var controller = this;
  controller.found = undefined;

  controller.search = function () {
    var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);
    promise.then(function (foundItems) {
        controller.found = foundItems;
    });
  }

  controller.remove = function(itemIndex) {
    if (controller.found != undefined) {
      controller.found.splice(itemIndex, 1);
    }
  } 
}

MenuSearchService.$inject = ['$http', 'endpoint'];
function MenuSearchService($http, endpoint) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: 'GET',
      url: endpoint
    }).then(function (result) {
      var foundItems = [];
      var menuItems = result.data.menu_items;

      menuItems.forEach(item => {
        if (searchTerm == undefined || !searchTerm.trim()) {
          return foundItems;
        }
        var description = item.description.toLowerCase();
        if (description.includes(searchTerm.toLowerCase())) {
          foundItems.push(item);
        }
      });

      return foundItems;
    }).catch(function (err) {
      console.log("ERROR: " + error);
    });
  }
}

function FoundItemsDirective() {
  // Retrieved from Lecture 30 Part 2
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundItems',
    bindToController: true
  };

  return ddo; 
}

function FoundItemsDirectiveController() {
  var foundItems = this;

  foundItems.shouldDisplayError = function() {
    if (foundItems.found != undefined && foundItems.found.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  foundItems.shouldDisplayTable = function() {
    if (foundItems.found != undefined && foundItems.found.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

})();
