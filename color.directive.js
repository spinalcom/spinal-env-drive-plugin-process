

angular.module('app.spinal-panel')
  .directive('colorpicker', ["ProcessManagerService",function(ProcessManagerService) {
    return {

      link: function (scope, elem, attrs) { 

        $(elem).on('change', function () {
          scope.$apply(function () {
            
            var color = $(elem).val();
            var groupId = $(elem).attr("groupid");
            var processId = $(elem).attr("processid");
            var priority = $(elem).attr("priority");

            ProcessManagerService.changeColor(groupId,processId,priority,color);
            
          });
        });
      }
    }
  }])