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
    let mod = FileSystem._objects[obj.file._server_id];

    $mdDialog.show({

        controller : ["$scope","$mdDialog","visaManagerService",($scope,$mdDialog,visaManagerService) => {
            
            /******************************************************************************** */

            $scope.getIdByPriority = function(themeId,priority,callback) {
                
                var x;
                for (var i = 0; i < $scope.groupProcess.length; i++) {
                    let myGroupProcess = $scope.groupProcess[i];
                    if(myGroupProcess._info.id == themeId) {
                        
                        myGroupProcess.load((data) => {
                            for (var j = 0; j < data.length; j++) {
                                if(data[j]._info.priority.get() == priority) {
                                    callback(data[j]._info.id.get());                                   
                                }
                            }                            
                        })

                        

                    }
                }

            }

            /*********************************************************************************** */


            $scope.groupProcess = visaManagerService.allProcess;
            $scope.visaSelected = {groupId : '0', processId : '0',priority : 0 };
            

            if(mod._info.visaProcessPlugin) {
                mod._info.visaProcessPlugin.load((data) => {
                    $scope.visaSelected = data.get();
                    $scope.oldVisaData = data.get();

                    for (var i = 0; i < visaManagerService.allProcess.length; i++) {
                        let process = visaManagerService.allProcess[i];
                        if(process._info.id.get() == data.groupId.get()) {
                            process.load((m) => {
                                $scope.processes = m;
                            });
                        }
                    }

                })               
 
            }
            

            $scope.display = false;
            


            $scope.SelectChanged = function() {


                for (var i = 0; i < $scope.groupProcess.length; i++) {
                    let process = $scope.groupProcess[i];
                    if(process._info.id.get() == $scope.visaSelected.groupId) {
                        process.load((m) => {
                            $scope.processes = m;
                        });
                    }
                }
                
                $scope.getIdByPriority($scope.visaSelected.groupId,$scope.visaSelected.priority,(data) => {
                    $scope.visaSelected.processId = data;
                });                
               
            }

            $scope.hide = function() {
                $mdDialog.hide()
            }

            $scope.cancel = function() {
                $mdDialog.cancel()
            }

            $scope.answer = function() {
                var result = {newValue : $scope.visaSelected, oldValue : $scope.oldVisaData};
                $mdDialog.hide(result);

            }


        }],
        template : $templateCache.get('addItemDialogTemplate.html'),
        parent : angular.element(document.body),
        targetEvent : obj.evt,
        clickOutsideToClose : false
      }).then((result) => {
            
            if(result.oldValue) {
                visaManagerService.deleteItem(obj.file._server_id,result.oldValue.groupId,result.oldValue.processId,result.oldValue.priority,() => {
                    visaManagerService.addItem(obj.file._server_id,result.newValue.groupId,result.newValue.processId,result.newValue.priority);
                });
                
            } else {
                visaManagerService.addItem(obj.file._server_id,result.newValue.groupId,result.newValue.processId,result.newValue.priority);
            }



      },() => {
          console.log("error");
      })   
   }


   
}

module.exports.SpinalDrive_App_FileExplorer_addItem = SpinalDrive_App_FileExplorer_addItem;