var showCollection = angular.module("showCollection",['ngRoute']);

showCollection.config(function($routeProvider){
  $routeProvider.when("/",{
    templateUrl:"views/collection.html",
      controller:"TodoCTRL"
  });
  $routeProvider.when("/swag",{
    template:"<h1>SWAG!</h1>"
  });
  $routeProvider.otherwise({
    template:"<b>Sorry, nothing found, only a 404 :(</b>"
  });
});

showCollection.controller("TodoCTRL",function($scope,$http){
    //$scope.sections = [{text:"SWAG"},{text:"SWAG2"}
    //]
    function getSections(){
      $http({method: 'GET', url: '/getsections'}).
          success(function(data) {
              $scope.sections = data;
              $(".collection").css("width",$scope.sections.length*275+275);
              $(".collection").css("height",$(window).height()-90);
              $.jInvertScroll(['.collection']);
          });
    }
    function getTodos(){
      $http({method: 'GET', url: '/gettodos'}).
          success(function(data) {
              $scope.todos = data;
          });
    };
    getSections();
    getTodos();
    //Actions for sections
    $scope.SectionADD = function(value){
        if(value!=null){
            $http({method: 'GET', url: '/getsections?query=insert&text='+value}).
                success(function(data) {
                    getSections();
                });
            $(".EditSection").val("");
        }else{
            $(".EditSection").attr("placeholder","Enter something :)");
        }
    }
    $scope.updateSection = function(id,text,statusold){
        if(text!=null){
          $http({method: 'GET', url: '/getsections?query=update&id='+id+'&text='+text}).
              success(function(data) {
                  getSections();
              })
          $http({method: 'GET', url: '/gettodos?query=updateSection&statusold='+statusold+'&status='+text}).
              success(function(data) {
                getTodos();
              });
          $(".EditSection").val("");
      }else{
          $(".EditSection").attr("placeholder","Enter something :)");
      }
    }
    $scope.removeSection = function(id,status){
        $http({method: 'GET', url: '/getsections?query=remove&id='+id}).
            success(function(data) {
                getSections();
            });
          $http({method: 'GET', url: '/gettodos?query=removeAllFromSection&status='+status}).
              success(function(data) {
                  getTodos();
              });

    }//Actions for todos
    $scope.TodoADD = function(status,value){
        if(value!=null){
            $http({method: 'GET', url: '/gettodos?query=insert&text='+value+'&status='+status}).
                success(function(data) {
                    getTodos();
                });
            $(".text-input").val("");
        }else{
            $(".text-input").attr("placeholder","Enter something :)");
        }
    }
    $scope.update = function(id,status){
        $http({method: 'GET', url: '/gettodos?query=update&id='+id+'&status='+status}).
            success(function(data) {
                getTodos();
            })
    }
    $scope.remove = function(id){
        $http({method: 'GET', url: '/gettodos?query=remove&id='+id}).
            success(function(data) {
                getTodos();
            });
    }
});
