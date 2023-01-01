define([], function () {

    return function (lanList, wanList, wlanList) {
        var _lanList = lanList;
        var _wanList = wanList;
        var _wlanList = wlanList;
        var _catPid;
        var isIE = function(ver){
            var b = document.createElement('b')
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
            return b.getElementsByTagName('i').length === 1
        };
        var cat = function (f){
            $.post('command.cgi?cat+'+f, function(data,status){
                if(status=="success" ){
                    if(data.substr(0,1)==">"){
                        if(_catPid == f){
                            var aTxt=data.substr(1);
                            if(isIE())aTxt=aTxt.replace(/\n/g,"<br />");
                            $("#output").append(aTxt);
                            setTimeout(function(){
                                cat(f,true);
                            },500);
                        }
                    }else{
                        $("#active").html("");
                        $("#capture_start").prop("disabled",false);
                        $("#export_button").prop("disabled",false);
                    }
                }
            });
        }

        var _captureStart = function (){
            $("#output").html("");
            var href = self.location.href + "?capture";
            $.post(href,$("#capture").serialize())
            .success(function(data,status){
                setTimeout(function(){
                    _catPid = data;
                    cat(_catPid);
                },500);
                $("#capture_start").prop("disabled",true);
                $('#export_button').prop("disabled",true);
            })
            .error(function(xhr, st, error){
                $("#active").html("error spawn command");
            })
        };

        var _captureStop = function (){
            $.ajax({
                type:'POST',
                url:"tcp_dump.cgi?cancel",
                data:'data'
            })
            .done(function(data){
            })
            .always(function(){
                $("#capture_stop").attr("disabled",false);
            })
            $(this).prop("disabled",true);
            $("#capture_start").prop("disabled",false);
            $('#export_button').prop("disabled",false);
        };
        var _exportSubmit = function (){
            $.ajax({
                type:'POST',
                url:self.location.href + "?export",
                data:'',
                success:function(data) {
                    if (data.indexOf("failDownload") !== -1){
                        alert($("#none_file").text());
                    }
                },
                error:function(xhr,st,e){
                }
            })
            .done(function(data){
            })
        };

        var _bindListener = function(){
            $('#capture_start').bind("click",function(){
                _captureStart();
            });
            $('#capture_stop').bind("click",function(){
                _captureStop();
            });
            $('#export_button').bind("click",function(){
                _exportSubmit();
            });
        };
        var _bindInterface = function(){
            $("select[name=interface]").append("<option value='any'>All</option>");
            $("select[name=interface]").append("<option value='br0'>Bridge Interface</option>");
            $.fn.append.apply(
                $("select[name='interface']"),
                $.map(_wlanList, function(wlan, i) {
                    if (wlan && wlan.Enable == 1) {
                        return $("<option/>").val(wlan.Name+".v0").html(wlan.SSID);
                    }
                })
            );
            $.fn.append.apply(
                $("select[name='interface']"),
                $.map(_lanList, function(lan, i) {
                    if (lan && lan.Status == 'Up') {
                        var index = lan.Name.split('.');
                        var Name = "LAN" + i;
                        return $("<option/>").val(lan.Name).html(Name);
                    }
                })
            );
            $.fn.append.apply(
                $("select[name='interface']"),
                $.map(
                    $.map(_wanList,function(conn,oid){
                        return $.map(conn.ipConns,function(ipConn,j){
                            if(ipConn.ConnectionStatus != "Connected" && ipConn.X_CT_COM_IPv6ConnStatus != "Connected") return[];
                            return {'n':ipConn.Name,'x':ipConn.X_ASB_COM_IfName};
                        })
                        .concat(
                            $.map(conn.pppConns,function(pppConn,j){
                                if(pppConn.ConnectionType == "PPPoE_Bridged" || (pppConn.ConnectionStatus != "Connected" && pppConn.X_CT_COM_IPv6ConnStatus != "Connected")) return[];
                                return {'n':pppConn.Name,'x':pppConn.X_ASB_COM_IfName};
                            })
                        )
                    }),
                    function(ifi,i){
                        return $("<option/>").val(ifi.x).html(ifi.n);
                    }
                )
            );
        };

        _bindWindow = function(){
            $(window).on('beforeunload', function(event) {
                $.ajax({
                    type:'POST',
                    url:self.location.pathname +"?cancel",
                    data:'data',
                    async: false,
                })
                .done(function(data){
                })
                .always(function(){
                })
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
                _bindWindow();
                _bindInterface();
            }
        }.constructor();
    };
});