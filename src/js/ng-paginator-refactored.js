'use strict';

angular.module('ngPaginatorPlz', [])

.directive('paginator', function(Paginator) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            pageSize: '@',
            exportPagedDataTo: '='
        },
        templateUrl: 'src/templates/paginator.html',
        controller: ['$scope',
            function($scope) {
                if (!angular.isArray($scope.exportPagedDataTo)) {
                    throw Error('You must provide an array to export paged data to. Got ' + $scope.exportPagedDataTo);
                }

                $scope.paginator = new Paginator({
                    data: $scope.data,
                    pageSize: Number($scope.pageSize || 20),
                    pagedDataReference: $scope.exportPagedDataTo
                });

                $scope.$watch('data', function(newData) {
                    $scope.paginator.setData(newData);
                });
            }
        ]
    };
})
    .factory('Paginator', function() {
        function Paginator(cfg) {
            this.data = [];
            this.pages = [];
            this.currentPageData = cfg.pagedDataReference || [];
            this.pageSize = cfg && cfg.pageSize ? cfg.pageSize : 20;
            this.currentPage = 1;
            this.setData(cfg && cfg.data || []);
        }

        Paginator.prototype.next = function() {
            var paginator = this;
            if (paginator.hasNext()) {
                paginator.setPage(paginator.currentPage + 1);
            }
        };

        Paginator.prototype.previous = function() {
            var paginator = this;
            if (paginator.hasPrevious()) {
                paginator.setPage(paginator.currentPage - 1);
            }
        };

        Paginator.prototype.setPage = function(page) {
            var paginator = this;
            paginator.currentPage = page;
            paginator.getPaginatedData();
        };

        Paginator.prototype.getCurrentPageNumber = function() {
            var paginator = this;
            return paginator.currentPage;
        };

        Paginator.prototype.getNumberOfPages = function() {
            var paginator = this;
            return Math.ceil(paginator.data.length / paginator.pageSize);
        };

        Paginator.prototype.getPaginatedData = function() {
            var paginator = this;
            paginator.currentPageData.length = 0;
            var pagedItems = paginator.data.slice((paginator.currentPage - 1) * paginator.pageSize, paginator.currentPage * paginator.pageSize);
            Array.prototype.push.apply(paginator.currentPageData, pagedItems);
            return paginator.currentPageData;
        };

        Paginator.prototype.setData = function(data) {
            var paginator = this,
                nrOfPages;

            if (!angular.isArray(data)) {
                throw Error('You must provide an array to Paginator.setData(). Got ' + data);
            }

            paginator.data.length = 0;
            paginator.pages.length = paginator.getNumberOfPages();

            if (angular.isArray(data)) {
                Array.prototype.push.apply(paginator.data, data);
            }
            paginator.getPaginatedData();

            nrOfPages = paginator.getNumberOfPages();
            for (var i = 0; i < nrOfPages; i++) {
                paginator.pages.push({});
            }
        };

        Paginator.prototype.hasPrevious = function() {
            var paginator = this;
            return paginator.getCurrentPageNumber() > 1;
        };

        Paginator.prototype.hasNext = function() {
            var paginator = this;
            return paginator.getCurrentPageNumber() < paginator.getNumberOfPages();
        };

        return Paginator;
    });