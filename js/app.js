"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var tasksUrl ='https://api.parse.com/1/classes/comments';

angular.module('AjaxChallenge', ["ui.bootstrap"])

    .config(function($httpProvider){
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'XkQ1aODXugcEHelVRTH2ZZFh7uebqUgpncKBTAws';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'is7AwTLezCg71ypLQsRkYInAnfHnWZzhn2n5cRyx';
    })
    .controller('CommentsCtrl', function($scope,$http){
        $scope.refreshComments = function(){
            $http.get(tasksUrl)
                .success(function(data) {
                    $scope.comments = data.results;
                    $scope.totalreview = data.results.length;
                });
        };

        $scope.refreshComments();

        $scope.newComment={scores : 0} ;

        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(tasksUrl,$scope.newComment)
                .success(function(responseData){
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {scores : 0};
                })
                .finally(function(){
                    $scope.inserting = false;
                })
        };
        $scope.updateComment = function(comment){
            $http.put(tasksUrl + '/' + comment.objectId, comment)
        };

        $scope.deleteComment = function(comment){
            console.log("mn");
            $http.delete(tasksUrl + '/' +comment.objectId)
        };



        $scope.incrementScores = function(comment,amount) {


            if (((comment.scores == null || comment.scores >= 0) && amount == 1) || comment.scores >= 1){

                var postData = {
                    scores: {
                        __op: "Increment",
                        amount: amount
                    }
                };
                $scope.updating = true;
                $http.put(tasksUrl + '/' + comment.objectId, postData)
                    .success(function (respData) {
                        comment.scores = respData.scores;

                    })
                    .error(function (err) {
                        console.log(err);
                    })
                    .finally(function () {
                        $scope.updating = false;
                    })
            }
        }
     });

angular.module('AjaxChallenge')


    .controller('OverallRatingCtrl', function ($scope,$http) {
        $scope.isReadonly = true;

        var index;
        var rate;
        var total=0;

        $http.get(tasksUrl)
            .success(function(data) {

                index = data.results.length;

                for(var i=0;i<index;i++){

                    rate = data.results[i].rate;
                    if(isNaN(rate)){
                        rate = 0;
                    }
                    total += parseInt(rate);
                }

                if(total == 0 || isNaN(total)){
                    $scope.percent = 0;
                    $scope.rate = 0;
                }else{
                    $scope.percent = parseInt(100 * total/(index*5));
                    $scope.rate=parseInt(($scope.percent/100)*5);
                }
            });

    });
