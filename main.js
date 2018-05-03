
require("spinal-env-drive-core");
require("./models");
require("./ProcessManagerService");
require("./ProcessManagerCtrl");
require("./add_item");
require("./color.directive");

require("./chart");
require("./chart.directive");


(function () {
  angular.module('app.spinal-panel')
    .run(["$templateCache", "$http", "goldenLayoutService",
      function ($templateCache, $http, goldenLayoutService) {
        let load_template = (uri, name) => {
          $http.get(uri).then((response) => {
            $templateCache.put(name, response.data);
          }, (errorResponse) => {
            console.log('Cannot load the file ' + uri);
          });
        };

        let toload = [{
          uri: '../templates/spinal-env-drive-plugin-process/visa-template.html',
          name: 'visa-template.html'
        },{
          uri: '../templates/spinal-env-drive-plugin-process/addItemDialogTemplate.html',
          name : 'addItemDialogTemplate.html'
        },{
          uri : '../templates/spinal-env-drive-plugin-process/addProcessTemplate.html',
          name : 'addProcessTemplate.html'
        },{
          uri : '../templates/spinal-env-drive-plugin-process/seeDetailTemplate.html',
          name : 'seeDetailTemplate.html'
        },{
          uri : '../templates/spinal-env-drive-plugin-process/chartTemplate.html',
          name : 'chartTemplate.html'
        }];


        for (var i = 0; i < toload.length; i++) {
          load_template(toload[i].uri, toload[i].name);
        }

        goldenLayoutService.registerPanel({
          id: "spinal-env-drive-plugin-process",
          name: "Process Profil",
          cfg: {
            isClosable: true,
            title: "Process Profil",
            type: 'component',
            width: 50,
            componentName: 'SpinalHome',
            componentState: {
              template: 'visa-template.html',
              module: 'app.spinal-visa',
              controller: 'ProcessManagerCtrl'
            }
          }
        });

        spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_addItem());

        

      }]);

})();
