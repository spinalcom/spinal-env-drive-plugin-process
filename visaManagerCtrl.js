
(function(){

angular.module('app.spinal-panel')
.controller('VisaManagerCtrl',["$scope","$templateCache","$mdDialog","ngSpinalCore","visaManagerService",
function($scope, $templateCache, $mdDialog,ngSpinalCore,visaManagerService) {

        $scope.seeVisaProcess = {visaselected : null,selectId : null, processSelected : null, isDisplay : 0};

        $scope.references;
        $scope.color;

        visaManagerService.allProcess.bind(() => {
          $scope.allVisaProcess = visaManagerService.allProcess;
          $scope.$apply();
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

              if(result && result.trim() != "")
                visaManagerService.addGroupProcess(result);
              
            }, () => { });
        }
        
        $scope.viewAllProcess = (visaProcess) => {
            $scope.seeVisaProcess.isDisplay += 1;

            $scope.seeVisaProcess.selectId = visaProcess._info.id;

            visaProcess.load((data) => {
              $scope.seeVisaProcess.visaselected = data;
            })
        }

        $scope.goBack = (home = undefined) => {
          if(home != undefined) {
            $scope.seeVisaProcess.isDisplay = 0;
          } else {
            $scope.seeVisaProcess.isDisplay -= 1;
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
              if(result && result.trim().length > 0) {
                for (var i = 0; i < visaManagerService.allProcess.length; i++) {
                  var visaProcess = visaManagerService.allProcess[i];
                  if(visaProcess._info.id == $scope.seeVisaProcess.selectId) {
                    visaProcess.load((data) => {
                      for (var j = 0; j < data.length; j++) {
                        if(data[j]._info.id == processId) {
                          data[j].name.set(result)
                        }
                      }                    
                    })
                    break;
                  }
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
              if(result && result.trim().length > 0){
                for (var i = 0; i < visaManagerService.allProcess.length; i++) {
                  var visaProcess = visaManagerService.allProcess[i];
                  if(visaProcess._info.id == groupProcessId) {
                    visaManagerService.allProcess[i].name.set(result);
                    break;
                  }
                }
              }

            }, () => { });
        }

        $scope.addProcessInGroup = (evt) => {
          var select = $scope.seeVisaProcess.visaselected;

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
                if($scope.name.trim().length > 0 && $scope.place != '-1' && $scope.visaS != '-1') {
                  var result = {name : $scope.name, place : $scope.place, priority : $scope.visaS};
                  $mdDialog.hide(result);
                } else {
                  console.log("error!!!!");
                }
              
              }
    
            }],
            template : $templateCache.get('addProcessTemplate.html'),
            parent : angular.element(document.body),
            targetEvent : evt,
            clickOutsideToClose : true
          })
          .then(function (result) {

            var id = $scope.seeVisaProcess.selectId;
            visaManagerService.addProcessInGroup(id,result.name,result.place,result.priority);

          }, () => { });
        }


/*                                                Reviser                                                                 */

       
        $scope.deleteItem = (item) => {
                  
        }

        $scope.deleteVisaProcess = (groupProcessId,processId,priority) => {

          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

            $mdDialog.show(dialog)
            .then((result) => {
              visaManagerService.deleteProcess(groupProcessId.get(),processId.get(),priority.get());
            },() => {console.log("error")})
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


        $scope.test = () => {
          console.log()
        }

        $scope.colorChanged = function () {
            console.log("yes");
        }
        
        $scope.getDate = function(id) {
          let mod = FileSystem._objects[id];
          if(mod) {
            return mod.load((data) => {
              return data.date.get();
            })
          }
        }


        $scope.seeAllItems = (visaselected,argProcess) => {
          $scope.allOtherProcess = [];

          for (var i = 0; i < visaselected.length; i++) {
            if(visaselected[i]._info.priority.get() != argProcess._info.priority.get()) {
              $scope.allOtherProcess.push(visaselected[i].get());
            }
          }
          
          $scope.seeVisaProcess.isDisplay += 1;

          $scope.seeVisaProcess.processSelected = [];

          $scope.iColor = argProcess._info.color.get();
          $scope.iName = argProcess.name.get();

          argProcess.load((data) => {
            $scope.seeVisaProcess.processSelected = data;
          })

        }
        
        
        $scope.ChangeItemProcess = (item,newPriority) => {
            // let mod = FileSystem._objects[item];
            // console.log(newPriority);
            // if(mod) {
            //   mod._info.visaProcessPlugin.load((data) => {
            //     visaManagerService.deleteItem(item,data.groupId.get(),data.processId.get(),data.priority.get());
            //     visaManagerService.addItem(item,data.groupId.get(),data.processId.get(),newPriority);
            //   })              
            // }
        }

        $scope.colorPicker = (evt) => {
          evt.stopPropagation();
        }


        $scope.SeeDetail = (visaProcess) => {

          $scope.seeVisaProcess.isDisplay = 3;
            visaManagerService.loadItem(visaProcess)
              .then((data1) => {

                $scope.references = data1.get();
                
                var promises = [];

                for(var i = 0; i < data1.length; i++) {
                  promises.push(visaManagerService.loadItem(data1[i]));
                }


                Promise.all(promises)
                  .then((values) => {
                      for(var i = 0; i < values.length; i++) {
                        $scope.references[i].items = values[i];
                      }
                  })


              },() => {
                console.log("error !");
              })

        }



        // $scope.folderDropCfg = {
        //   "drop": (event) => {
        //     event.stopPropagation(); 
        //     event.preventDefault();
        //     console.log("drop")
        //     let selected = spinalFileSystem.FE_selected_drag;
        //     $scope.loading = true;
        //     if (selected && selected[0]) {
        //       console.log("drop")
        //       // $scope.fs_path = Array.from(spinalFileSystem.FE_fspath_drag);
        //       // let serv_id = FileSystem._objects[selected[0]._server_id];
        //       // let logPtr = serv_id._info.log;
        //       // if (logPtr) {
        //       //   logPtr.load((log) => {
        //       //     let tab = [];
        //       //     for (var i = 0; i < log.length; i++) {
        //       //       tab.push({
        //       //         action: log[i].action.get(),
        //       //         date: new Date(log[i].date.get()).toLocaleString(),
        //       //         name: log[i].name.get()
        //       //       });
        //       //     }
        //       //     $scope.name = selected[0].name;
        //       //     $scope.records = tab;
        //       //     $scope.loading = false;
        //       //     $scope.$apply();
        //       //   });
        //       // } else {
        //       //   $scope.name = selected[0].name;
        //       //   $scope.records = [];
        //       //   $scope.loading = false;
        //       // }
        //     }
        //     return false;
        //   },
        //   "dragover": (event) => {
        //     event.preventDefault();
        //     return false;
        //   },
        //   "dragenter": (event) => {
        //     event.preventDefault();
        //     return false;
        //   }

        // };

  }])

})();