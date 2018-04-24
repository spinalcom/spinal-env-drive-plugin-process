
angular.module("app.spinal-panel")
    .factory("visaManagerService",["ngSpinalCore","authService","$q",
        function(ngSpinalCore,authService,$q) {


            let factory = {}

            var initQ;


            factory.init = () => {
                if(initQ) {
                   return initQ.promise; 
                }
                initQ = $q.defer()
                ngSpinalCore.load_root()
                .then((data) => {
                    
    
                    for (var i = 0; i < data.length; i++) {
                        if(data[i].name.get() == "__process__") {
                            data[i].load((m) => {
                                factory.allProcess = m;
                                initQ.resolve(m)
                            })
                            
                            return;
                            
                        }
                        
                    }
                    factory.allProcess = new Directory();
                    data.add_file("__process__",factory.allProcess,{id : factory.newGuid(),model_type : "Directory"});
                    initQ.resolve(factory.allProcess);
    
    
                },() => {
                })
    
                return initQ.promise
            }

            authService.wait_connect();
            factory.init()

            factory.newGuid = () => {
                var d = new Date().getTime();
                var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                });
                return guid;
            };

            factory.loadItem = (item) => {
                return new Promise((resolve,reject) => {
                    item.load((data) => {
                        resolve(data)
                    },() => {
                        reject("error");
                    })
                })
            }

            factory.addGroupProcess = (name) => {

                var visaGroup = new Directory();
                
                var processInvalid = new Directory();
                var processValid = new Directory();
                var processWarning = new Directory();

                
                visaGroup.add_file("not valid",processInvalid,{id : factory.newGuid(),priority : 0, color : "#F21B2C" });
                visaGroup.add_file("Validation in progress",processWarning,{id : factory.newGuid(),priority : 1, color : "#FFEB56" });
                visaGroup.add_file("Valid",processValid,{id : factory.newGuid(),priority : 2,color : "#008348"});

                factory.allProcess.add_file(name,visaGroup,{id : factory.newGuid()});
            }

            factory.addProcessInGroup = (groupId,name,place,priority) => {
                
                var myPriority;
    
                if(place == '0') {
                    myPriority = parseInt(priority);
                } else if(place == '1') {
                    myPriority = parseInt(priority) + 1;
                }   
    
    
                if(myPriority != undefined) {

                    for (var i = 0; i < factory.allProcess.length; i++) {
                        var visaProcess = factory.allProcess[i];




                        if(visaProcess._info.id.get() == groupId.get()) {

                            visaProcess.load((data) => {

                                for (var k = 0; k < data.length; k++) {
                                    if(data[k]._info.priority.get() >= myPriority) {
                                        data[k]._info.priority.set(parseInt(data[k]._info.priority.get()) + 1);
                                    }
                                }

                                data.add_file(name,new Directory(),{id : factory.newGuid(),priority : myPriority,color : "#000000"});

                            })

                        }

                    }                    
    
                }
            }

            factory.deleteProcess = (groupProcessId,processId,priority) => {
                
                for (var i = 0; i < factory.allProcess.length; i++) {
                    var groupProcess = factory.allProcess[i];

                    if(groupProcess._info.id.get() == groupProcessId) {
                        var x;
                        groupProcess.load((data) => {
                            for (var j = 0; j < data.length; j++) {

                                if(data[j]._info.priority.get() > priority) {
                                    data[j]._info.priority.set(data[j]._info.priority.get() - 1);
                                } 

                                if(data[j]._info.id.get() == processId) {
                                    x = j;
                                }
                            }

                            data.splice(x,1);

                        })

                        
                                                  
                    }
                        
                }
                
            }

            factory.deleteGroupProcess = (groupProcessId) => {
                for (var i = 0; i < factory.allProcess.length; i++) {
                    let groupProcess = factory.allProcess[i];
                    if(groupProcess._info.id == groupProcessId) {
                        factory.allProcess.splice(i,1);

                        break;
                    }
                }
            }
            
            factory.addItem = (item,groupId,processId,priority) => {
            
                let mod = FileSystem._objects[item];
                
                if(mod) {

                    if(mod._info.visaPluginDate) {
                        mod._info.visaPluginDate.set(Date.now());
                    } else {
                        mod._info.add_attr({
                            visaPluginDate : Date.now()
                        })
                    }
    
                    if(mod._info.visaProcessPlugin) {
                        mod._info.visaProcessPlugin.load((data) => {
                            data.groupId.set(groupId);
                            data.processId.set(processId);
                            data.priority.set(priority);
                            
                        })
                    } else {
                        factory.items = new StateModel(priority);
                        factory.items.groupId.set(groupId);
                        factory.items.processId.set(processId);
                        factory.items.priority.set(priority);
                        factory.items.date.set(Date.now());
    
                        mod._info.add_attr({
                            visaProcessPlugin: new Ptr(factory.items)
                        })

                        
                    }    
                
                    for (var i = 0; i < factory.allProcess.length; i++) {
                        var groupVisa = factory.allProcess[i]
                        if(groupVisa._info.id.get() == groupId) {

                            groupVisa.load((data) => {
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j]._info.id.get() == processId) {
                                        data[j].load((m) => {
                                            m.push(mod)
                                        })
                                    }
                                }
                            })
    
                            break;
                        }
                    }
                }
        
            }
                           
            factory.deleteItem = (item,groupId,processId,priority,callback) => {

                let mod = FileSystem._objects[item];
                if(mod) {
    
                    for (var i = 0; i < factory.allProcess.length; i++) {
                        var groupVisa = factory.allProcess[i]
                        if(groupVisa._info.id.get() == groupId) {

                            // factory.allProcess[i].load((data) => {

                        
                            factory.loadItem(groupVisa)
                                .then((data1) => {
                                    for(var j = 0; j < data1.length; j++) {
                                        if(data1[j]._info.priority.get() == priority) {
                                            
                                            factory.loadItem(data1[j])
                                                .then((data2) => {
                                                    for (var k = 0; k < data2.length; k++) {
                                                        if(data2[k]._server_id == item){                                                    
                                                            data2.splice(k,1);
                                                            mod._info.rem_attr("visaProcessPlugin")
                                                            callback();
                                                        }
                                                    }
                                                })

                                            break;
                                        }
                                    }
                                })
   
                        break;
                    
                    } 
        
        
                }
            } else {
                console.log("mod null")
            }
        }

            factory.changeColor = (groupId,processId,priority,val) => {

                for (var i = 0; i < factory.allProcess.length; i++) {
                    if(factory.allProcess[i]._info.id == groupId) {
                        factory.loadItem(factory.allProcess[i])
                            .then((data1) => {
                                for (var j = 0; j < data1.length; j++) {
                                    if(data1[j]._info.id == processId && data1[j]._info.priority.get() == priority) {
                                        data1[j]._info.color.set(val);
                                    }
                                }                                
                            })                        
                    }
                }
            }
            
            return factory;

        }])