

angular.module('app.spinal-panel')
.directive('chart', function() {
  return {

    link: function (scope, elem, attrs) {

        var ctx = $(elem)[0].getContext("2d");

        // scope.$watch(attrs.element,(oldV,newV) => {
        //   console.log("newV",newV);
        //   console.log(oldV);
        // })

        var data = {

            datasets: [{
                data: scope[attrs.element].data,
                backgroundColor: scope[attrs.element].background
            }],

            labels: scope[attrs.element].label
        };

        var myPieChart = new Chart(ctx,{
            type: 'pie',
            data: data
        });
        
    }
  }
})