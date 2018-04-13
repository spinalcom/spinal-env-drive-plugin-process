
(function(){

angular.module('app.spinal-panel')
.controller('VisaManagerCtrl',["$scope","$templateCache","$mdDialog","ngSpinalCore","visaManagerService",
function($scope, $templateCache, $mdDialog,ngSpinalCore,visaManagerService) {

        $scope.seeVisaProcess = {visaselected : null, processSelected : null, isDisplay : 0};

        visaManagerService.allProcess.bind(() => {
          ngSpinalCore.store(visaManagerService.allProcess,"/__process__/");
          $scope.allVisaProcess = visaManagerService.allProcess;
        })



        $scope.addGroupProcess = () => {
            $mdDialog.show($mdDialog.prompt()
            .title("Add  Group Visa Process")
            .placeholder('Please enter the Name')
            .ariaLabel('Add Group Visa Process')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {

              visaManagerService.addGroupProcess(result);
              
            }, () => { });
        }

        $scope.addProcessInGroup = () => {
            $mdDialog.show($mdDialog.prompt()
            .title("Add Visa Process")
            .placeholder('Please enter the Name')
            .ariaLabel('Add Visa Process')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {
              var id = $scope.seeVisaProcess.visaselected.id;
              visaManagerService.addProcessInGroup(id,result);

            }, () => { });
        }


        
        $scope.viewAllProcess = (visaProcess) => {
            $scope.seeVisaProcess.isDisplay += 1;
            $scope.seeVisaProcess.visaselected = visaProcess;
        }

        $scope.goBack = () => {
          $scope.seeVisaProcess.isDisplay -= 1;
        }

        $scope.seeAllItems = (argProcess) => {
          $scope.seeVisaProcess.isDisplay += 1;

          for (var i = 0; i < $scope.seeVisaProcess.visaselected.process.length; i++) {
            var process = $scope.seeVisaProcess.visaselected.process[i];

            if(process.id == argProcess.id) {
              $scope.seeVisaProcess.processSelected = argProcess;
              break;
            }

          }

        }

        
        $scope.deleteItem = (item) => {
          console.log(item);
        }

        $scope.deleteGroupVisa = (groupVisaId) => {
          var dialog = $mdDialog.confirm()
                .ok("Delete !")
                .title('Do you want to remove it?')
                .cancel('Cancel')
                .clickOutsideToClose(true);

                $mdDialog.show(dialog)
                .then((result) => {
                  visaManagerService.deleteGroupProcess(groupVisaId);
                },() => {console.log("error")}) 
          
        }

        $scope.deleteVisaProcess = (groupProcessId,processId) => {
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

            $mdDialog.show(dialog)
            .then((result) => {
              visaManagerService.deleteProcess(groupProcessId,processId);
            },() => {console.log("error")})
        }



        $scope.SeeDetail = (visaProcessId) => {
          $scope.seeVisaProcess.isDisplay += 1;
          for (var i = 0; i < visaManagerService.length.length; i++) {
            let groupVisa = visaManagerService.length[i];
            if(groupVisa.id == visaProcessId) {
              return groupVisa;
            }
          }
        }





}])

})();