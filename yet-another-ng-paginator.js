'use strict';

angular.module('YAngPaginator', [])
  .directive('paginator', function () {

    function Paginator(cfg) {
      this.data = [];
      this.pages = [];
      this.currentPageData = [];
      this.pageSize = cfg && cfg.pageSize ? cfg.pageSize : 20;
      this.setData(cfg && cfg.data || []);
      this.currentPage = 1;
    }

    Paginator.prototype.next = function () {
      var paginator = this;
      if (paginator.hasNext()) {
        paginator.setPage(paginator.currentPage + 1);
      }
    };

    Paginator.prototype.previous = function () {
      var paginator = this;
      if (paginator.hasPrevious()) {
        paginator.setPage(paginator.currentPage - 1);
      }
    };

    Paginator.prototype.setPage = function (page) {
      var paginator = this;
      paginator.currentPage = page;
    };

    Paginator.prototype.getCurrentPageNumber = function () {
      var paginator = this;
      return paginator.currentPage;
    };

    Paginator.prototype.getNumberOfPages = function () {
      var paginator = this;
      return Math.ceil(paginator.data.length / paginator.pageSize);
    };

    Paginator.prototype.getPaginatedData = function () {
      var paginator = this;
      paginator.currentPageData.length = 0;
      var pagedItems = paginator.data.slice((paginator.currentPage - 1) * paginator.pageSize, paginator.currentPage * paginator.pageSize);
      Array.prototype.push.apply(paginator.currentPageData, pagedItems);
      return paginator.currentPageData;
    };

    Paginator.prototype.setData = function (data) {
      var paginator = this,
        nrOfPages;

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

    Paginator.prototype.hasPrevious = function () {
      var paginator = this;
      return paginator.getCurrentPageNumber() > 1;
    };

    Paginator.prototype.hasNext = function () {
      var paginator = this;
      return paginator.getCurrentPageNumber() < paginator.getNumberOfPages();
    };

    return {
      restrict: 'E',
      scope: {
        data: '=',
        pageSize: '=',
        currentPageData: '=' // exports to parent dom for current page data show
      },
      templateUrl: 'paginator.html',
      controller: ['$scope', '$element', function ($scope, $elem) {
        function _pagination() {
          $scope._pg = new Paginator({
            data: $scope.data,
            pageSize: $scope.pageSize
          });
          $scope.currentPageData = $scope._pg.currentPageData;
        }

        $scope.$watch('data', _pagination);
      }]
    };
  });
