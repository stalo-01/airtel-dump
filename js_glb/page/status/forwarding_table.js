define([], function () {

    return function (lanEth) {
        var _lanEth = lanEth;
        var _routeList;
        var _route6List;
        var _macList;
        var _arpList;
        var _brList;
        var _showAll = function(){
            $.ajax({
                type:'GET',
                url:'/forwarding_table.cgi'+'?all',
                data:'',
                success:function(data) {
                    var dataAll = $.parseJSON(data);
                    _macList = dataAll.mac_info;
                    _routeList = dataAll.route_info;
                    _arpList = dataAll.arp_info;
                    _route6List = dataAll.route6_info;
                    _brList = dataAll.br_info;
                    _fetchMacTable();
                    _fetchRouteTable();
                    _fetchArpTable();
                    _fetchRoute6Table();
                },
                error:function(xhr,st,e){
                }
            })
            .done(function(data){
            })
        }
        var _showMac = function(){
            $.ajax({
                type:'GET',
                url:'/forwarding_table.cgi'+'?mac',
                data:'',
                success:function(data) {
                    _macList = $.parseJSON(data).mac_info;
                    _brList = $.parseJSON(data).br_info;
                    _fetchMacTable();
                },
                error:function() {
                }
            })
            .done(function(data){
            })
        }
        var _showRoute = function(){
            $.ajax({
                type:'GET',
                url:'/forwarding_table.cgi'+'?route',
                data:'',
                success:function(data) {
                    _routeList = $.parseJSON(data).route_info;
                    _fetchRouteTable();
                },
                error:function() {
                }
            })
            .done(function(data){
            })
        }
        var _showRoute6 = function(){
            $.ajax({
                type:'GET',
                url:'/forwarding_table.cgi'+'?route6',
                data:'',
                success:function(data) {
                    _route6List = $.parseJSON(data).route6_info;
                    _fetchRoute6Table();
                },
                error:function() {
                }
            })
            .done(function(data){
            })
        }
        var _showArp = function(){
            $.ajax({
                type:'GET',
                url:'/forwarding_table.cgi'+'?arp',
                data:'',
                success:function(data) {
                    _arpList = $.parseJSON(data).arp_info;
                    _fetchArpTable();
                },
                error:function() {
                }
            })
            .done(function(data){
            })
        }
        
        var _bindListener = function(){
           $('#refresh_mac').bind("click",function(){
                _showMac();
            });
            
            $('#refresh_routing').bind("click",function(){
                _showRoute();
            });
            $('#refresh_routing6').bind("click",function(){
                _showRoute6();
            });
            $('#refresh_arp').bind("click",function(){
                _showArp();
            });
       }
        var _fetchMacTable = function(){
            var br_name=[];
            var br_sfu = _brList.br_sfu;
            for (index in br_sfu){
                var tmp = br_sfu[index]+".0";
                br_name.push(_lanEth[tmp]);
            }
            $("#bridge_mac_table").empty();//WLNP requirment: only show mac under bridge port, br_sfu
            $.each(_macList,function(j,info){
                if(info.port <= 5 && info.port > 1){//WLNP ONU have 4 ports, port range 2-5
                    $("#bridge_mac_table").append(
                        $("<tr/>").append(
                            $("<td/>").html(br_name[info.port - 2]),
                            $("<td/>").html(info.mac),
                            $("<td/>").html(info.local),
                            $("<td/>").html(info.agening_time)
                        )
                    );
                }
            });
        }

        var _fetchRouteTable = function(){
            $("#routing_table").empty();
            $.each(_routeList,function(j,info){
                $("#routing_table").append(
                    $("<tr/>").append(
                        $("<td/>").html(info.destination),
                        $("<td/>").html(info.gateway),
                        $("<td/>").html(info.genmask),
                        $("<td/>").html(info.flags),
                        $("<td/>").html(info.metric),
                        $("<td/>").html(info.ref),
                        $("<td/>").html(info.use),
                        $("<td/>").html(info.iface)
                    )
                );
            });
        }
        var _fetchRoute6Table = function(){
            $("#routing6_table").empty();
            $.each(_route6List,function(j,info){
                if(info.iface != "lo" && info.destination != "ff00::/8"){
                    $("#routing6_table").append(
                        $("<tr/>").append(
                            $("<td/>").html(info.destination),
                            $("<td/>").html(info.hop),
                            $("<td/>").html(info.flags),
                            $("<td/>").html(info.metric),
                            $("<td/>").html(info.ref),
                            $("<td/>").html(info.use),
                            $("<td/>").html(info.iface)
                        )
                    );
                }
            });
        }
        var _fetchArpTable = function(){
            $("#arp_table").empty();
            $.each(_arpList,function(j,info){
                if(ValidMacAddress(info.mac)){
                    $("#arp_table").append(
                        $("<tr/>").append(
                            $("<td/>").html(info.ip),
                            $("<td/>").html(info.mac),
                            $("<td/>").html(info.iface)
                        )
                    );
                }
            });
        }

        return{
            constructor : function(){
                _self = this;
                _self.init();
                return this;
            },

            init : function(){
                _bindListener();
                _showAll();
            }
        }.constructor();
    };
});