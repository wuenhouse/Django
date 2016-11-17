function MainCtrl($http) {
    var vm = this;
    vm.config = {
        method: "get",
        url: "",
        responseType: "json",
        xsrfHeaderName: ""
    };
    vm.colors = [
          { name: 'shop', shade: 'shop' },
          { name: 'freq', shade: 'freq' },
          { name: 'money', shade: 'money' },
          { name: 'nes', shade: 'nes' },
          { name: 'l', shade: 'l' },
          { name: 'r', shade: 'r' },
          { name: 'f', shade: 'f' },
          { name: 'm', shade: 'm' },
          { name: 'gender', shade: 'gender' },
          { name: 'province', shade: 'province' },
          { name: 'education', shade: 'education' }
    ];
    vm.Category = vm.colors[0]
    
    var chart ;
    vm.query = function () {
        var url = "http://10.0.1.22:8000/lemon/d1/" + vm.Category.name + "/";
        vm.config.url = url;
        vm.API = url;
        var D1 = [];
        $http.get(url, vm.config).
          success(function (data, status, headers, config) {
              var dd = data.DATA;
              for (var ii = 0 ; ii < Object.keys(dd).length ; ii++) {
                  D1.push([Object.keys(dd)[ii], dd[Object.keys(dd)[ii]]]);
              }
              generateC3(D1, "chart1", vm.Category.name);
          }).
          error(function (data, status, headers, config) {
          });
    };
    vm.generateP = function () {
        var url = "http://10.0.1.22:8000/lemon/d1/" + vm.Category.name + "/";
        vm.config.url = url;
        vm.API = url;
        var D1 = [];
        $http.get(url, vm.config).
          success(function (data, status, headers, config) {
              var dd = data.DATA;
              for (var ii = 0 ; ii < Object.keys(dd).length ; ii++) {
                  D1.push([Object.keys(dd)[ii], dd[Object.keys(dd)[ii]]]);
              }
              generateC3(D1, "chart1", vm.Category.name);
          }).
          error(function (data, status, headers, config) {
          });
    };
    function generateC3(Data, tags, Cate) {
        if (Cate != "money") {
            chart = c3.generate({
                bindto: '#' + tags + '',
                data: {
                    // iris data from R
                    columns: Data,
                    type: 'pie',
                    onclick: function (d, i) {
                        alert(d.id);
                        //console.log("onclick", d, i);
                    },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                }
            });
        } else {
            chart = c3.generate({
                bindto: '#' + tags + '',
                data: {
                    // iris data from R
                    columns: Data,
                    type: 'bar',
                    onclick: function (d, i) {
                        alert(d.id);
                        //console.log("onclick", d, i);
                    },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                }
            });
        }

    }

}