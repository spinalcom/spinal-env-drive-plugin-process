

angular.module("app.spinal-panel")
    .factory("visaManagerService",["ngSpinalCore","authService",
    function(ngSpinalCore,authService) {
        let factory = {}

        authService.wait_connect();

        factory.allProcess = new Lst();

        ngSpinalCore.load("/__process__/")
            .then((data) => {
                factory.allProcess.set(data);
            },() => {
                ngSpinalCore.store(factory.allProcess,"/__process__/");
            })



        factory.addGroupProcess = (name) => {
            var visaGroup = new VisaGroupModel();
            visaGroup.name.set(name);

            var processValid = new ProcessModel(2);
            processValid.name.set("Valid");
            processValid.color.set("#008348");

            var processWarning = new ProcessModel(1);
            processWarning.name.set("Validation in progress");
            processWarning.color.set("#FFEB56");

            var processInvalid = new ProcessModel(0);
            processInvalid.name.set("Invalid");
            processInvalid.color.set("#F21B2C");

            visaGroup.process.push(processInvalid);
            visaGroup.process.push(processWarning);
            visaGroup.process.push(processValid);

            factory.allProcess.push(visaGroup);
        }


        
        factory.addProcessInGroup = (groupId,name) => {
            var newVisaProcess = new ProcessModel();
            newVisaProcess.name.set(name);
            newVisaProcess.color.set("#000000");
            for (var i = 0; i < factory.allProcess.length; i++) {
                let visaProcess = factory.allProcess[i];

                if(visaProcess.id == groupId) {
                    factory.allProcess[i].process.push(newVisaProcess);
                    break;
                }
            }
        }



        factory.deleteGroupProcess = (groupProcessId) => {
            for (var i = 0; i < factory.allProcess.length; i++) {
                let groupProcess = factory.allProcess[i];
                if(groupProcess.id == groupProcessId) {
                    factory.allProcess.splice(i,1);
                    break;
                }
            }
        }
        
        

        factory.deleteProcess = (groupProcessId,processId) => {
            for (var i = 0; i < factory.allProcess.length; i++) {
                var groupProcess = factory.allProcess[i];
                if(groupProcess.id == groupProcessId) {
                    for (var j = 0; j < groupProcess.process.length; j++) {
                        let process = groupProcess.process[j];
                        if(process.id == processId) {
                            factory.allProcess[i].process.splice(j,1);
                            break;
                        }
                        
                    }
                    break;
                }
            }
        }



        factory.addItem = (item,groupId,processId,priority) => {
            
            let mod = FileSystem._objects[item];
            if(mod) {
                // if(mod.visaProcessPlugin == undefined) {
                //     mod.add_attr({
                //         visaProcessPlugin : new Ptr(factory.itemList)
                //     })
                // } else {
                //     mod.load((m) => {
                //         factory.itemList = m;
                //     })
                // }

                // factory.itemList.push({visaGroupId : groupId,visaProcessId : processId})

                if(mod._info.visaProcessPlugin) {
                    mod._info.visaProcessPlugin.load((data) => {
                        
                        var myItem = new StateModel(priority);

                        myItem.groupId.set(groupId);
                        myItem.stateId.set(processId);
                        myItem.priority.set(priority);
                        myItem.date.set(Date.now());

                        data.push(myItem);
                    })
                } else {
                    factory.items = new Lst();
                    mod._info.add_attr({
                        visaProcessPlugin: new Ptr(factory.items)
                    })
                    var myItem = new StateModel(priority);
                    myItem.groupId.set(groupId);
                    myItem.stateId.set(processId);
                    myItem.date.set(Date.now());

                    factory.items.push(myItem);
                    
                }    
            
                for (var i = 0; i < factory.allProcess.length; i++) {
                    var groupVisa = factory.allProcess[i]
                    if(groupVisa.id == groupId) {
                        for (var j = 0; j < groupVisa.process.length; j++) {
                            var process = groupVisa.process[j];
                            if(process.id == processId) {
                                factory.allProcess[i].process[j].items.push(mod);
                                break;
                            }
                        }

                        break;
                    }
                }
            }
   
        }


        factory.deleteItem = (item,groupId,processId,priority) => {


            

            let mod = FileSystem._objects[item];
            if(mod) {

                for (var i = 0; i < factory.allProcess.length; i++) {
                    var groupVisa = factory.allProcess[i]
                    if(groupVisa.id == groupId) {
                        for (var j = 0; j < groupVisa.process.length; j++) {
                            var process = groupVisa.process[j];
                            if(process.priority == priority) {
                                var itemList = factory.allProcess[i].process[j].items;
                                console.log();
                                for (var k = 0; k < itemList.length; k++) {
                                    console.log("process.items[k]._server_id",itemList[k]._server_id)
                                    console.log("item",item);

                                    if(itemList[k]._server_id == item) {
                                        console.log("condition 3 exact");
                                        factory.allProcess[i].process[j].items.splice(k,1);
                                        break;
                                    }
                                }
                            }
                        }

                        break;
                    }
                }

                if(mod._info.visaProcessPlugin) {
                    mod._info.visaProcessPlugin.load((data) => {
                        for (var i = 0; i < data.length; i++) {
                            var x = data[i];

                            console.log("x.groupId",x.groupId.get(),"groupId",groupId)
                            console.log("x.stateId",x.stateId.get(),"processId",processId)
                            console.log("x.priority",x.priority.get(),"priority",priority)

                            if(x.groupId.get() == groupId && x.priority.get() == priority) {
                                console.log("all condition exact")
                                data.splice(i,1);
                                break;
                            }
                        }
                    })
                }

               
               
            } else {
                console.log("mod null")
            }


        }
        
        return factory;

    }])