

angular.module('app.spinal-panel')
  .directive('colorpicker', ["visaManagerService",function(visaManagerService) {
    return {

      link: function (scope, elem, attrs) { 

        $(elem).on('change', function () {
          scope.$apply(function () {
            
            var color = $(elem).val();
            var groupId = $(elem).attr("groupid");
            var processId = $(elem).attr("processid");
            var priority = $(elem).attr("priority");

            visaManagerService.changeColor(groupId,processId,priority,color);
            
          });
        });
      }
    }
  }])