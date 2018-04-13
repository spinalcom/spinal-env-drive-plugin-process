/**
 * SpinalDrive_App_FileExplorer_addItem
 * @extends {SpinalDrive_App}
 */

class SpinalDrive_App_FileExplorer_addItem extends SpinalDrive_App  {
    /**
   * Creates an instance of SpinalDrive_App_FileExplorer_addItem.
   * @memberof SpinalDrive_App_FileExplorer_addItem
   */

    constructor() {
        super("AddItemExplorer","Visa..","edit","Add to a visa");  
    }

    /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_addItem
   */

   

   action(obj) {
    let _self = this;
       
    let $mdDialog =  obj.scope.injector.get('$mdDialog');
    // let $scope =  obj.scope.injector.get('$scope');
    let $templateCache = obj.scope.injector.get('$templateCache');
    let visaManagerService = obj.scope.injector.get('visaManagerService');
    
    $mdDialog.show({
        controller : ["$scope","$mdDialog","visaManagerService",_self.dialogCtrl],
        template : $templateCache.get('addItemDialogTemplate.html'),
        parent : angular.element(document.body),
        targetEvent : obj.evt,
        clickOutsideToClose : false
      }).then((result) => {

            visaManagerService.addItem(obj.file._server_id,result.groupId,result.processId)
      },() => {
          console.log("error");
      })   
   }


    dialogCtrl($scope,$mdDialog,visaManagerService) {
        $scope.groupProcess = visaManagerService.allProcess;
        $scope.visaSelected = {groupId : '0', processId : '0'};
        $scope.processes = [];

        $scope.isDisabled = true;

        $scope.SelectChanged = function() {
            $scope.isDisabled = false;
            $scope.visaSelected.processId = '0';
            for (var i = 0; i < $scope.groupProcess.length; i++) {
                let process = $scope.groupProcess[i];
                if(process.id == $scope.visaSelected.groupId) {
                    $scope.processes = process;
                    break;
                }

            }
        }


        $scope.hide = function() {
            $mdDialog.hide()
        }

        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        $scope.answer = function() {
            if($scope.visaSelected.groupId != '0' && $scope.visaSelected.processId != '0') {
                $mdDialog.hide($scope.visaSelected);
            } else {
                $mdDialog.cancel();
            }
        }

    }
   
}

module.exports.SpinalDrive_App_FileExplorer_addItem = SpinalDrive_App_FileExplorer_addItem;