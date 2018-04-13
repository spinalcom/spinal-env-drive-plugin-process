

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

            var processValid = new ProcessModel();
            processValid.name.set("Valid");
            processValid.color.set("#008348");

            var processWarning = new ProcessModel();
            processWarning.name.set("Validation in progress");
            processWarning.color.set("#FFEB56");

            var processInvalid = new ProcessModel();
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



        factory.addItem = (item,groupId,processId) => {
            
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
                    mod.load((data) => {
                        factory.items = data;
                    })
                } else {
                    factory.items = new StateModel();
                    mod._info.add_attr({
                        visaProcessPlugin: new Ptr(factory.items)
                    })
                }

                factory.items.groupId.set(groupId);
                factory.items.stateId.set(processId);

            
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

        
        return factory;

    }])