
(function(){

angular.module('app.spinal-panel')
.controller('VisaManagerCtrl',["$scope","$templateCache","$mdDialog","ngSpinalCore","visaManagerService",
function($scope, $templateCache, $mdDialog,ngSpinalCore,visaManagerService) {

        $scope.seeVisaProcess = {visaselected : null, processSelected : null, isDisplay : 0};

        $scope.references;

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
        
        $scope.viewAllProcess = (visaProcess) => {
            $scope.seeVisaProcess.isDisplay += 1;
            $scope.seeVisaProcess.visaselected = visaProcess;
        }

        $scope.goBack = (home = undefined) => {
          if(home != undefined) {
            $scope.seeVisaProcess.isDisplay = 0;
          } else {
            $scope.seeVisaProcess.isDisplay -= 1;
          }
          
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


        $scope.SeeDetail = (visaProcessId) => {
          $scope.seeVisaProcess.isDisplay = 3;
          for (var i = 0; i < visaManagerService.allProcess.length; i++) {
            let groupVisa = visaManagerService.allProcess[i];
            if(groupVisa.id == visaProcessId) {
              
              $scope.references = groupVisa.process;
              // console.log($scope.references.process)
            }
          }
        }

        $scope.renameProcess = (processId) => {


          $mdDialog.show($mdDialog.prompt()
            .title("Rename")
            .placeholder('Please enter the Name')
            .ariaLabel('Rename')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {
              for (var i = 0; i < visaManagerService.allProcess.length; i++) {
                var visaProcess = visaManagerService.allProcess[i];
                if(visaProcess.id == $scope.seeVisaProcess.visaselected.id) {
                  for (var j = 0; j < visaProcess.process.length; j++) {
                    var process = visaProcess.process[j];
                    if(process.id == processId) {
                      visaManagerService.allProcess[i].process[j].name = result;
                      break;
                    }
                  }
                  break;
                }
              }

            }, () => { });
        }

        $scope.renameGroupProcess = (groupProcessId) => {
          $mdDialog.show($mdDialog.prompt()
            .title("Rename")
            .placeholder('Please enter the Name')
            .ariaLabel('Rename')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {
              for (var i = 0; i < visaManagerService.allProcess.length; i++) {
                var visaProcess = visaManagerService.allProcess[i];
                if(visaProcess.id == groupProcessId) {
                  visaManagerService.allProcess[i].name = result;
                  break;
                }
              }

            }, () => { });
        }

        $scope.addProcessInGroup = (evt) => {
          var select = $scope.seeVisaProcess.visaselected.process;

          $mdDialog.show({
            controller : ["$scope","$mdDialog",function addProcessCtrl($scope,$mdDialog) {
              
              $scope.name = "";
              $scope.place = '-1';
              $scope.visaS = '-1';
              
              $scope.processList = select;
              
              
              $scope.cancel = function() {
                $mdDialog.cancel()
              }
    
              $scope.answer = function() {
                var result = {name : $scope.name, place : $scope.place, priority : $scope.visaS};
                $mdDialog.hide(result);
                
              }
    
            }],
            template : $templateCache.get('addProcessTemplate.html'),
            parent : angular.element(document.body),
            targetEvent : evt,
            clickOutsideToClose : true
          })
          .then(function (result) {

            var id = $scope.seeVisaProcess.visaselected.id;
            visaManagerService.addProcessInGroup(id,result.name,result.place,result.priority);

          }, () => { });
        }

        $scope.deleteVisaProcess = (groupProcessId,processId,priority) => {
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

            $mdDialog.show(dialog)
            .then((result) => {
              visaManagerService.deleteProcess(groupProcessId,processId,priority);
            },() => {console.log("error")})
        }

        /* *********************************       Reviser                               */

        
        $scope.getDate = function(id) {
          let mod = FileSystem._objects[id];
          if(mod) {
            return mod.load((data) => {
              // // return data.date.get()
              // console.log(data);
              return Date.now();
            })
          }
        }

        $scope.folderDropCfg = {
          "drop": (event) => {
            event.stopPropagation(); 
            event.preventDefault();
            console.log("drop")
            let selected = spinalFileSystem.FE_selected_drag;
            $scope.loading = true;
            if (selected && selected[0]) {
              console.log("drop")
              // $scope.fs_path = Array.from(spinalFileSystem.FE_fspath_drag);
              // let serv_id = FileSystem._objects[selected[0]._server_id];
              // let logPtr = serv_id._info.log;
              // if (logPtr) {
              //   logPtr.load((log) => {
              //     let tab = [];
              //     for (var i = 0; i < log.length; i++) {
              //       tab.push({
              //         action: log[i].action.get(),
              //         date: new Date(log[i].date.get()).toLocaleString(),
              //         name: log[i].name.get()
              //       });
              //     }
              //     $scope.name = selected[0].name;
              //     $scope.records = tab;
              //     $scope.loading = false;
              //     $scope.$apply();
              //   });
              // } else {
              //   $scope.name = selected[0].name;
              //   $scope.records = [];
              //   $scope.loading = false;
              // }
            }
            return false;
          },
          "dragover": (event) => {
            event.preventDefault();
            return false;
          },
          "dragenter": (event) => {
            event.preventDefault();
            return false;
          }

        };

  }])

})();