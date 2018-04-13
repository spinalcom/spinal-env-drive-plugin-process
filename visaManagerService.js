

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

        return factory;

    }])