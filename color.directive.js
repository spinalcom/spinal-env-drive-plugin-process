

angular.module('app.spinal-panel')
  .directive('colorpicker', function() {
    return {
      require: '?ngModel',
      link: function (scope, elem, attrs, ngModel) { 
       
          $(elem).spectrum({
            clickoutFiresChange: true,
            showInput: false,
            showSelectionPalette : false,
            replacerClassName : 'colorPick'
          });

          $(elem).attr("type","color");

          console.log("before return")
          if (!ngModel) return;
          console.log("after return !")
          ngModel.$render = function () {
            $(elem).spectrum('set', ngModel.$viewValue);
          };
          $(elem).on('change', function () {
            scope.$apply(function () {
              ngModel.$setViewValue(elem.val());
            });
          });
      }
    }
  })