import { Add_Item } from "./add_item";

require("spinal-env-drive-core");
require("./models");
require("./visaManagerService");
require("./visaManagerCtrl");
require("./add_item");


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
          uri: '../templates/spinal-env-visa/visa-template.html',
          name: 'visa-template.html'
        },{
          uri: '../templates/spinal-env-visa/addItemDialogTemplate.html',
          name : 'addItemDialogTemplate.html'
        },{
          uri : '../templates/spinal-env-visa/addProcessTemplate.html',
          name : 'addProcessTemplate.html'
        }];
        for (var i = 0; i < toload.length; i++) {
          load_template(toload[i].uri, toload[i].name);
        }

        goldenLayoutService.registerPanel({
          id: "spinal-env-visa",
          name: "Profil Visa",
          cfg: {
            isClosable: true,
            title: "Profil Visa",
            type: 'component',
            width: 20,
            componentName: 'SpinalHome',
            componentState: {
              template: 'visa-template.html',
              module: 'app.spinal-visa',
              controller: 'VisaManagerCtrl'
            }
          }
        });

        spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_FileExplorer_addItem());

        

      }]);

})();
