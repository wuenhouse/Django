console.log('js1 done');
var app = angular.module("myApp", []);
app.controller('MainCtrl', function ($scope, $http, $templateCache) {
    console.log('js2 done');
    var vm = this;
    vm.btn1_msg = '-- Select datasource --';
    vm.btn2_msg = '-- Select client --';
    vm.btn3_msg = '-- Select host --';
    vm.btn4_msg = '-- Select target --';
    vm.listname = '';
    vm.show = false;
    vm.showmenu = false;
    vm.SortByDate = true;
    vm.sortshow1 = false;
    vm.sortshow2 = false;
    vm.sortshow3 = false;
    vm.sortshow4 = false;
    vm.sortshow5 = false;
    vm.sortshow6 = false;
    vm.sortshow7 = false;
    vm.sortshow8 = false;
    vm.msg = false;
    vm.domain = "http://10.10.22.16:8000";
    vm.shopid = $("#sid").text();
    vm.datepicker = false;
    vm.result_show = false;
    vm.start = moment().format('L');
    vm.end = moment().format('L');
    vm.POSTDATA = {};
    vm.scheduledata = [];
    // data model
    vm.panelshows = [{'no':1, 'show':false}, {'no':2, 'show':false}, {'no':3, 'show':false}, {'no':4, 'show':false}, {'no':5, 'show':false}];
    vm.hideall = function(index){
        for(var i=0; i < vm.panelshows.length ; i++) {
            var d = vm.panelshows[i];
            if (index != i + 1){
                d.show = false;
            }else{
                d.show = true;
            }
        };
        vm.result_show = false;
    };
    vm.schedule = {mode:'0'};

    // get data source -- api -- should be componment
    var hosturl = 'http://etlgo.staging.migoapp.com/api/source';
    var req = {
        method: 'GET',
        url: hosturl,
        headers: {
           'Content-Type': 'application/json',
        }
    }
    vm.databaselist = [];
    $http(req).then(function(response){
        var type_id = '';
        var r = {};
        serverlist = response.data;
        serverlist.forEach(function(item){

            if (type_id != item.type_id){
                if (Object.keys(r).length != 0) {
                    //vm.src_db.push(r);
                    vm.databaselist.push(r);
                }
                r = {};
                r['type_id'] = item.type_id;
                r['type_name'] = item.type_name;
                r['companys'] = [];
                type_id = item.type_id;
            }
            r['companys'].push({'company_name': item.company_name, 'acct_company_id': item.acct_company_id, 'company_code': item.company_code});

        });
        //vm.src_db.push(r); // add last host
        vm.databaselist.push(r); // add last host
    },
    function(response){});

    // get target infomation -- api should be compoment
    vm.servers = [];
    var serverurl = 'http://etlgo.staging.migoapp.com/api/server';
    var req = {
        method: 'GET',
        url: serverurl,
        headers: {
           'Content-Type': 'application/json',
        }
    }
    $http(req).then(function(response){
        var svr_id = '';
        var r = {};
        serverlist = response.data;
        serverlist.forEach(function(item){
            if (svr_id != item.svr_id){
                if (Object.keys(r).length != 0) {
                    vm.servers.push(r);
                }
                r = {};
                r['svr_id'] = item.svr_id;
                r['svr_name'] = item.svr_name;
                r['clients'] = [];
                svr_id = item.svr_id;
            }
            r['clients'].push({'client_name': item.client_name, 'client_id': item.client_id});

        });
        vm.servers.push(r);
    },
    function(response){});

    // get list data
    vm.getlist = function(){
        var url = 'http://etlgo.staging.migoapp.com/api/event/';
        var req = {
            method: 'GET',
            url: url,
            headers: {
               'Content-Type': 'application/json',
            }
        }
        $http(req).then(function(response){
            serverlist = response.data;
            vm.scheduledata = serverlist;
            if (serverlist.length > 0) {
                vm.clk(5);
            }
        },
        function(response){
        });
    };
    vm.getlist();

    vm.menus = [
        {'text': 'DataBase Select', 'isselect':false},
        {'text': 'Select Client', 'isselect': false},
        {'text': 'Select Target', 'isselect': false},
        {'text': 'Select Schedule', 'isselect': false},
        {'text': 'Schedule List', 'isselect': false},
    ];
    vm.cli = [];
    vm.clients = [];
    vm.buttonls = [
        {'class':'glyphicon glyphicon-hdd', 'index':1},
        {'class':'glyphicon glyphicon-user', 'index':2},
        {'class':'glyphicon glyphicon-list-alt', 'index':3}, 
        {'class':'glyphicon glyphicon-calendar', 'index':4}
    ];

    // fucntions
    vm.test = function(){
        if(vm.schedule.mode == 1){ vm.datepicker = true } else { vm.datepicker = false}
    }
    vm.clk = function(index){
        vm.hideall(index);
    };
    vm.expore = function(){
        if (vm.showmenu == false){ vm.showmenu = true} else { vm.showmenu = false}
    };
    $scope.src_sel = function(select){
        vm.btn1_msg = select.type_name;
        vm.POSTDATA['type_id'] = select.type_id
        //vm.clk(2)
        vm.clients = select.companys;
    };
    $scope.cli_sel = function(select){
        vm.btn2_msg = select.company_name;
        vm.POSTDATA['acct_company_id'] = select.acct_company_id;
        //vm.clk(3);
    };
    $scope.host_sel = function(select){
        vm.btn3_msg = select.svr_name;
        vm.POSTDATA['svr_id'] = select.svr_id
        vm.cli = select.clients;
    };
    $scope.target_sel = function(select){
        vm.btn4_msg = select.client_name;
        vm.POSTDATA['client_id'] = select.client_id
        //vm.clk(4);
    };    
    vm.change = function(item){
        var idx = vm.menus.indexOf(item);
        vm.clk(idx + 1)
        for(var i=0; i < vm.menus.length ; i++) {
            var d = vm.menus[i];
            d.isselect = false;
            vm.unset = true;
        }
        item.isselect = true;
    };
    vm.save_check = function(){ 
        if (vm.schedule.mode == 1){
            vm.start = $('#txt_start').val();
            vm.end = $('#txt_end').val();
        };
        vm.POSTDATA['start'] = vm.start;
        vm.POSTDATA['end'] = vm.end;
        vm.result_show = true;
    };
    vm.new = function(){
        var url = "http://etlgo.staging.migoapp.com/api/event/";
        url_method = 'POST';

        if (vm.id){
            url = url + '?id=' + vm.id;
            url_method = 'PUT';
        }   
        D = {
            "task": vm.listname,
            "type_id": vm.POSTDATA['type_id'],
            "acct_company_id": vm.POSTDATA['acct_company_id'],
            "mail": vm.emails,
            "svr_id": vm.POSTDATA['svr_id'],
            "client_id": vm.POSTDATA['client_id'],
            "schedule": vm.schedule.mode,
            "date_start": vm.start.split('/')[2] + "-" + vm.start.split('/')[0] + "-" + vm.start.split('/')[1] + "T00:00:00",
            "date_end": vm.end.split('/')[2] + "-" + vm.end.split('/')[0] + "-" + vm.end.split('/')[1] + "T00:00:00",
            "note": ""
        }
        var req = {
            method: url_method,
            url: url,
            data: D,
            headers: {
               'Content-Type': 'application/json',
            }
        }
        $http(req).then(function(response){
            vm.getlist();
        }, function(response){  });
    };
    vm.del = function(item){
        var id = item.id;
        var url = "http://etlgo.staging.migoapp.com/api/event/?id=" + id;
        var req = {
            method: 'DELETE',
            url: url,
            headers: {
               'Content-Type': 'application/json',
            }
        }
        $http(req).then(function(response){
            vm.getlist();
        }, function(response){  });
    };
    vm.sort = function(property, idx){
        vm.property_name = property;
        vm.SortByDate = (vm.SortByDate == true) ? false : true;
        vm['sortshow' + idx ]= (vm['sortshow' + idx] == true) ? false : true;
    }
    vm.edit = function(item){
        vm.id = item.id;
        vm.listname = item.task;
        vm.POSTDATA['type_id'] = item.type_id;
        vm.btn1_msg = item.type_name;
        vm.databaselist.some(function(x){
            if(x.type_id == item.type_id){
                vm.clients = x.companys;
            }
        })
        vm.schedule.mode = item.schedule; 
        if (item.schedule == 1) { vm.datepicker = true;}
        vm.POSTDATA['acct_company_id'] = item.acct_company_id;
        vm.btn2_msg = item.company_name
        vm.POSTDATA['svr_id'] = item.svr_id;
        vm.btn3_msg = item.svr_name
        vm.emails = item.mail
        vm.servers.some(function(x){
            if(x.svr_id == item.svr_id){
                vm.cli = x.clients;
            }
        })
        vm.POSTDATA['client_id'] = item.client_id;
        vm.btn4_msg = item.client_name;
        $('#txt_start').val(item.date_start.substring(0,10).split('-')[1] + "/" + item.date_start.substring(0,10).split('-')[2] + "/" + item.date_start.substring(0,10).split('-')[0]);
        $('#txt_end').val(item.date_end.substring(0,10).split('-')[1] + "/" + item.date_end.substring(0,10).split('-')[2] + "/" + item.date_end.substring(0,10).split('-')[0]);
        vm.clk(1);
        //var idx = vm.scheduledata.indexOf(item);
        //vm.scheduledata.splice(idx, 1);
    };
});
