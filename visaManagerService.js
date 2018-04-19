
angular.module("app.spinal-panel")
    .factory("visaManagerService",["ngSpinalCore","authService",
        function(ngSpinalCore,authService) {


            let factory = {}



            authService.wait_connect();


            factory.newGuid = () => {
                var d = new Date().getTime();
                var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                });
                return guid;
            };


            ngSpinalCore.load_root()
            .then((data) => {
                

                for (var i = 0; i < data.length; i++) {
                    if(data[i].name.get() == "__process__") {
                        data[i].load((m) => {
                            factory.allProcess = m;
                        })
                        return;
                    }
                    
                }

                factory.allProcess = new Directory();
                data.add_file("__process__",factory.allProcess,{id : factory.newGuid(),model_type : "Directory"});


            },() => {
            })


            factory.addGroupProcess = (name) => {

                var visaGroup = new Directory();
                
                var processInvalid = new Directory();
                var processValid = new Directory();
                var processWarning = new Directory();

                visaGroup.add_file("Valid",processValid,{id : factory.newGuid(),priority : 2,color : "#008348"});
                visaGroup.add_file("not valid",processInvalid,{id : factory.newGuid(),priority : 0, color : "#F21B2C" });
                visaGroup.add_file("Validation in progress",processWarning,{id : factory.newGuid(),priority : 1, color : "#FFEB56" });

                factory.allProcess.add_file(name,visaGroup,{id : factory.newGuid()});
            }

            factory.addProcessInGroup = (groupId,name,place,priority) => {
                console.log("groupId ==>",groupId);
                console.log("name ==>",name);
                console.log("place ==>",place);
                console.log("priority ==>",priority);
                
                var myPriority;
    
                if(place == '0') {
                    myPriority = parseInt(priority);
                } else if(place == '1') {
                    myPriority = parseInt(priority) + 1;
                }   
    
    
                if(myPriority != undefined) {
                    
                    console.log("my priority not null");

                    for (var i = 0; i < factory.allProcess.length; i++) {
                        var visaProcess = factory.allProcess[i];




                        if(visaProcess._info.id.get() == groupId.get()) {
                            console.log("condition exact");
                            visaProcess.load((data) => {
                                console.log("data",data);
                                for (var k = 0; k < data.length; k++) {
                                    if(data[k]._info.priority.get() >= myPriority) {
                                        data[k]._info.priority.set(parseInt(data[k]._info.priority.get()) + 1);
                                    }
                                }

                                data.add_file(name,new Directory(),{id : factory.newGuid(),priority : myPriority,color : "#000000"});

                            })

                        }

                    }                    
                    
                    // for (var i = 0; i < factory.allProcess.length; i++) {
                    //     let visaProcess = factory.allProcess[i];
    
                    //     if(visaProcess_.info.id == groupId) {
    
                    //         for (var j = 0; j < visaProcess.process.length; j++) {
                                
                    //             console.log("visaProcess.process[j].priority",visaProcess.process[j].priority.get())
                    //             console.log("myPriority",myPriority);
    
                    //             if(visaProcess.process[j].priority.get() >= myPriority) {
                    //                 console.log("condition true");
                    //                 factory.allProcess[i].process[j].priority.set(parseInt(factory.allProcess[i].process[j].priority) + 1);
                    //             }
                    //         }
    
                    //         factory.allProcess[i].process.push(newVisaProcess);
                    //         break;
                    //     }
                    // }
                }
            }

            factory.deleteProcess = (groupProcessId,processId,priority) => {
                for (var i = 0; i < factory.allProcess.length; i++) {
                    var groupProcess = factory.allProcess[i];
                    console.log("groupProcess._info.id",groupProcess._info.id)
                    console.log("groupProcessId",groupProcessId)
                    if(groupProcess._info.id == groupProcessId) {
                        console.log("condition vraie !!")
                        groupProcess.load((data) => {
                            for (var j = 0; j < data.length; j++) {
                               if(data[j]._info.id == processId) {
                                    data.splice(j,1);                        
                                }

                                if(data[j]._info.priority > priority) {
                                    data[j]._info.priority.set(data[j]._info.priority.get() - 1);
                                }
                            }
                        })
                        
                    }
                }
            }

            factory.deleteGroupProcess = (groupProcessId) => {
                for (var i = 0; i < factory.allProcess.length; i++) {
                    let groupProcess = factory.allProcess[i];
                    if(groupProcess._info.id == groupProcessId) {
                        console.log("condition true !!");
                        factory.allProcess.load((data) => {
                            data.splice(i,1);
                        })
                        break;
                    }
                }
            }
            

            return factory;

        }])







// angular.module("app.spinal-panel")
//     .factory("visaManagerService",["ngSpinalCore","authService",
//     function(ngSpinalCore,authService) {
//         let factory = {}

//         authService.wait_connect();

//         factory.allProcess = new Lst();

//         ngSpinalCore.load("/__process__/")
//             .then((data) => {
//                 factory.allProcess.set(data);
//             },() => {
//                 ngSpinalCore.store(factory.allProcess,"/__process__/");
//             })



//         factory.addGroupProcess = (name) => {
//             var visaGroup = new VisaGroupModel();
//             visaGroup.name.set(name);

//             var processValid = new ProcessModel(2);
//             processValid.name.set("Valid");
//             processValid.color.set("#008348");

//             var processWarning = new ProcessModel(1);
//             processWarning.name.set("Validation in progress");
//             processWarning.color.set("#FFEB56");

//             var processInvalid = new ProcessModel(0);
//             processInvalid.name.set("Invalid");
//             processInvalid.color.set("#F21B2C");

//             visaGroup.process.push(processInvalid);
//             visaGroup.process.push(processWarning);
//             visaGroup.process.push(processValid);

//             factory.allProcess.push(visaGroup);
//         }

        
//         factory.addProcessInGroup = (groupId,name,place,priority) => {
//             var myPriority = null;

//             if(place == '0') {
//                 myPriority = parseInt(priority);
//             } else if(place == '1') {
//                 myPriority = parseInt(priority) + 1;
//             }        
            
            
//             console.log(myPriority)


//             if(myPriority != null) {
//                 var newVisaProcess = new ProcessModel(myPriority);
//                 newVisaProcess.name.set(name);
//                 newVisaProcess.color.set("#000000");

                
//                 for (var i = 0; i < factory.allProcess.length; i++) {
//                     let visaProcess = factory.allProcess[i];

//                     if(visaProcess.id == groupId) {

//                         for (var j = 0; j < visaProcess.process.length; j++) {
                            
//                             console.log("visaProcess.process[j].priority",visaProcess.process[j].priority.get())
//                             console.log("myPriority",myPriority);

//                             if(visaProcess.process[j].priority.get() >= myPriority) {
//                                 console.log("condition true");
//                                 factory.allProcess[i].process[j].priority.set(parseInt(factory.allProcess[i].process[j].priority) + 1);
//                             }
//                         }

//                         factory.allProcess[i].process.push(newVisaProcess);
//                         break;
//                     }
//                 }
//             }
//         }


//         factory.deleteGroupProcess = (groupProcessId) => {
//             for (var i = 0; i < factory.allProcess.length; i++) {
//                 let groupProcess = factory.allProcess[i];
//                 if(groupProcess.id == groupProcessId) {
//                     factory.allProcess.splice(i,1);
//                     break;
//                 }
//             }
//         }
        

//         factory.deleteProcess = (groupProcessId,processId,priority) => {
//             for (var i = 0; i < factory.allProcess.length; i++) {
//                 var groupProcess = factory.allProcess[i];
//                 if(groupProcess.id == groupProcessId) {
//                     for (var j = 0; j < groupProcess.process.length; j++) {
//                         let process = groupProcess.process[j];
//                         if(process.id == processId) {
//                             factory.allProcess[i].process.splice(j,1);
//                         }

//                         if(process.priority > priority) {
//                             factory.allProcess[i].process[j].priority.set(parseInt(factory.allProcess[i].process[j].priority) - 1)
//                         }
                        
//                     }
//                     break;
//                 }
//             }
//         }


//         factory.addItem = (item,groupId,processId,priority) => {
            
//             let mod = FileSystem._objects[item];
//             if(mod) {
//                 // if(mod.visaProcessPlugin == undefined) {
//                 //     mod.add_attr({
//                 //         visaProcessPlugin : new Ptr(factory.itemList)
//                 //     })
//                 // } else {
//                 //     mod.load((m) => {
//                 //         factory.itemList = m;
//                 //     })
//                 // }

//                 // factory.itemList.push({visaGroupId : groupId,visaProcessId : processId})

//                 if(mod._info.visaProcessPlugin) {
//                     mod._info.visaProcessPlugin.load((data) => {
                        

//                         data.groupId.set(groupId);
//                         data.processId.set(processId);
//                         data.priority.set(priority);
//                         data.date.set(Date.now());

//                         // var myItem = new StateModel(priority);
//                         // myItem.groupId.set(groupId);
//                         // myItem.processId.set(processId);
//                         // myItem.priority.set(priority);
//                         // myItem.date.set(Date.now());
//                         // data.push(myItem);
//                     })
//                 } else {
//                     // factory.items = new Lst();

//                     factory.items = new StateModel(priority);
//                     factory.items.groupId.set(groupId);
//                     factory.items.processId.set(processId);
//                     factory.items.priority.set(priority);
//                     factory.items.date.set(Date.now());

//                     mod._info.add_attr({
//                         visaProcessPlugin: new Ptr(factory.items)
//                     })
//                     // var myItem = new StateModel(priority);
//                     // myItem.groupId.set(groupId);
//                     // myItem.processId.set(processId);
//                     // myItem.date.set(Date.now());

//                     // factory.items.push(myItem);
                    
//                 }    
            
//                 for (var i = 0; i < factory.allProcess.length; i++) {
//                     var groupVisa = factory.allProcess[i]
//                     if(groupVisa.id == groupId) {
//                         for (var j = 0; j < groupVisa.process.length; j++) {
//                             var process = groupVisa.process[j];
//                             if(process.id == processId) {
//                                 factory.allProcess[i].process[j].items.push(mod);
//                                 break;
//                             }
//                         }

//                         break;
//                     }
//                 }
//             }
   
//         }


//         factory.deleteItem = (item,groupId,processId,priority) => {


            

//             let mod = FileSystem._objects[item];
//             if(mod) {

//                 for (var i = 0; i < factory.allProcess.length; i++) {
//                     var groupVisa = factory.allProcess[i]
//                     if(groupVisa.id == groupId) {
//                         for (var j = 0; j < groupVisa.process.length; j++) {
//                             var process = groupVisa.process[j];
//                             if(process.priority == priority) {
//                                 var itemList = factory.allProcess[i].process[j].items;
//                                 for (var k = 0; k < itemList.length; k++) {
//                                     if(itemList[k]._server_id == item) {
//                                         factory.allProcess[i].process[j].items.splice(k,1);
//                                         break;
//                                     }
//                                 }
//                             }
//                         }

//                         break;
//                     }
//                 }

//                 // if(mod._info.visaProcessPlugin) {
//                 //     mod._info.visaProcessPlugin.load((data) => {
//                 //         for (var i = 0; i < data.length; i++) {
//                 //             var x = data[i];

//                 //             if(x.groupId.get() == groupId && x.priority.get() == priority) {
//                 //                 console.log("all condition exact")
//                 //                 data.splice(i,1);
//                 //                 break;
//                 //             }
//                 //         }
//                 //     })
//                 // }

               
               
//             } else {
//                 console.log("mod null")
//             }


//         }
        
//         return factory;

//     }])