

(function(){

angular.module('app.spinal-panel')
.controller('ProcessManagerCtrl',["$scope","$templateCache","$mdDialog","ngSpinalCore","ProcessManagerService","spinalFileSystem","$compile","$rootScope",
function($scope, $templateCache, $mdDialog,ngSpinalCore,ProcessManagerService,spinalFileSystem,$compile,$rootScope) {

        $scope.seeVisaProcess = {visaselected : null,selectId : null, processSelected : null, isDisplay : 0};

        $scope.references;
        $scope.color;
        let init = ProcessManagerService.init()

        init.then(()=>{
          ProcessManagerService.allProcess.bind(() => {
            $scope.allVisaProcess = ProcessManagerService.allProcess;
            $scope.$apply();
          })
        })

        $scope.addGroupProcess = () => {
            $mdDialog.show($mdDialog.prompt()
            .title("Add  Group Process")
            .placeholder('Please enter the Name')
            .ariaLabel('Add Group Visa Process')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Confirm').cancel('Cancel'))
            .then(function (result) {

              if(result && result.trim() != "")
                ProcessManagerService.addGroupProcess(result);
              
            }, () => { });
        }
        
        $scope.viewAllProcess = (visaProcess) => {
            $scope.seeVisaProcess.isDisplay += 1;

            $scope.seeVisaProcess.selectId = visaProcess._info.id;

            visaProcess.load((data) => {
              $scope.seeVisaProcess.visaselected = data;
              $scope.$apply();
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
                for (var i = 0; i < ProcessManagerService.allProcess.length; i++) {
                  var visaProcess = ProcessManagerService.allProcess[i];
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
                for (var i = 0; i < ProcessManagerService.allProcess.length; i++) {
                  var visaProcess = ProcessManagerService.allProcess[i];
                  if(visaProcess._info.id == groupProcessId) {
                    ProcessManagerService.allProcess[i].name.set(result);
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
              $scope.description = "";
              
              $scope.processList = select;
              
              
              $scope.cancel = function() {
                $mdDialog.cancel()
              }
    
              $scope.answer = function() {
                if($scope.name.trim().length > 0 && $scope.place != '-1' && $scope.visaS != '-1') {
                  var result = {name : $scope.name, place : $scope.place, priority : $scope.visaS,description : $scope.description.trim()};
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
            ProcessManagerService.addProcessInGroup(id,result.name,result.place,result.priority,result.description,() => {
              $scope.$apply();
            });

          }, () => { });
        }

/*                                                Reviser                                                                 */
        $scope.deleteVisaProcess = (groupProcessId,processId,priority) => {

          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

            $mdDialog.show(dialog)
            .then((result) => {
              ProcessManagerService.deleteProcess(groupProcessId.get(),processId.get(),priority.get(),() => {
                $scope.$apply();
              });
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
              ProcessManagerService.deleteGroupProcess(groupVisaId);
            },() => {console.log("error")})
          
        }

        $scope.seeAllItems = (visaselected,argProcess) => {
          $scope.allOtherProcess = [];
          $scope.argProcessSelected = argProcess.get();
          // $scope.seeVisaProcess.visaselected = visaselected;


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
            $scope.$apply();
          })

        }
       
        $scope.ChangeItemProcess = (item,oldProcess,newProcess) => {

          var oldPriority = oldProcess._info.priority;
          var oldProcessId = oldProcess._info.id;

          if($scope.seeVisaProcess.selectId != null) {
            var oldGroupId = $scope.seeVisaProcess.selectId.get();
          } else {
            var oldGroupId = $scope.seeVisaProcess.visaselected._info.id.get();
          }

          var newPriority = newProcess._info.priority;
          var newProcessId = newProcess._info.id;          


          if(oldPriority != newPriority) {
            ProcessManagerService.deleteItem(item,oldGroupId,oldProcessId,oldPriority,() => {
              ProcessManagerService.addItem(item,oldGroupId,newProcessId,newPriority);
            });
          }

        }

        $scope.SeeDetail = (visaProcess) => {

          $scope.seeVisaProcess.isDisplay = 3;
          $scope.seeVisaProcess.visaselected = visaProcess;


            ProcessManagerService.loadItem(visaProcess)
              .then((data1) => {

                $scope.references = data1.get();
                
                var promises = [];

                for(var i = 0; i < data1.length; i++) {
                  promises.push(ProcessManagerService.loadItem(data1[i]));
                }


                Promise.all(promises)
                  .then((values) => {
                      for(var i = 0; i < values.length; i++) {
                        $scope.references[i].items = values[i];
                      }
                      $scope.$apply();
                  })


              },() => {
                console.log("error !");
              })

        }

    
        $scope.deleteItem = (item,ptr_id) => {
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

          let mod = FileSystem._objects[ptr_id];

          if(mod) {
            ProcessManagerService.loadItem(mod)
              .then((val) => {
                $mdDialog.show(dialog)
                  .then((result) => {
                    ProcessManagerService.deleteItem(item,val.groupId.get(),val.processId.get(),val.priority.get(),() => {
                      $scope.$apply();
                    });
                    // $scope.$apply();          
                  },() => {})
                })
          } else {
            console.log("error");
            
          }

        }


        $scope.SeeDescription = (evt,visaProcess) => {
          $mdDialog.show({
            controller : ["$scope","$mdDialog",function addProcessCtrl($scope,$mdDialog) {
 
              $scope.name = visaProcess.name.get();
              $scope.description = visaProcess._info.description.get();
              $scope.disabled = false;


              $scope.cancel = function() {
                $mdDialog.cancel()
              }
    
              $scope.answer = function() {
                  $mdDialog.hide({id : visaProcess._server_id,description : $scope.description})
              }
    
            }],
            template : $templateCache.get('seeDetailTemplate.html'),
            parent : angular.element(document.body),
            targetEvent : evt,
            clickOutsideToClose : true
          }).then((result) => {
           let mod = FileSystem._objects[result.id];
           if(mod) {
             mod._info.description.set(result.description);
           }
          })
        }


        $scope.SeeCamembert = (evt,visaProcess) => {

          $mdDialog.show({
            template : $templateCache.get('chartTemplate.html'),
            parent : angular.element(document.body),
            targetEvent : evt,
            clickOutsideToClose : false,
            controller : ["$scope","$mdDialog","ProcessManagerService",function addProcessCtrl($scope,$mdDialog,ProcessManagerService) {
              $scope.name = visaProcess.name.get();

              $scope.el = {
                data : [],
                background : [],
                label : []
              }

              ProcessManagerService.loadItem(visaProcess).then((el) => {
                

                for (var i = 0; i < el.length; i++) {
                  $scope.el.label.push(el[i].name.get());
                  $scope.el.background.push(el[i]._info.color.get());
                  ProcessManagerService.loadItem(el[i])
                    .then((data1) => {
                      $scope.el.data.push(data1.length)
                    },() => {
                      $scope.el.data.push(0);
                    })
                }

              })

              $scope.cancel = function() {
                $mdDialog.cancel()
              }
    
              $scope.answer = function() {
                  $mdDialog.hide();
              }
    
            }]
          }).then((el) => {

          })
        }

        // $scope.folderDropCfg = {
        //   "drop": (event) => {
        //     event.stopPropagation(); 
        //     event.preventDefault();

        //     $scope.seeVisaProcess.isDisplay = 4;          

        //     let selected = spinalFileSystem.FE_selected_drag;
        //     $scope.loading = true;
        //     if (selected) {

        //       for (var i = 0; i < selected.length; i++) {
        //         console.log(selected[i])
        //       }

        //       // console.log("drop");
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