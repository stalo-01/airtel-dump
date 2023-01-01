define([], function () {

    return function (lanList,wlanList,rateLimitRule,greLans,lanIfip) {
        /*limit mode:
        0: off
        1: interface
        2: vlan tag
        3:ip pool*/
        var _lanList = lanList;
        var _wlanList = wlanList;
        var _rateLimitRule = rateLimitRule;
        var _greLans = greLans;
        var _lanIfip = lanIfip;
        var upItfRule = _rateLimitRule.UpStreamInterfaceLimit.split(",");
        var upIpRule = _rateLimitRule.UpStreamIPLimit.split(",");
        var downItfRule = _rateLimitRule.DownStreamInterfaceLimit.split(",");
        var downIpRule = _rateLimitRule.DownStreamIPLimit.split(",");

        var checkOverlapIP = function(sInput,eInput,sStatic,eStatic){
            var flag = 1;//has overlap IP as default
            if(sInput.indexOf(".")>0 && sStatic.indexOf(".")>0) {
                if(ip2int(eInput) < ip2int(sStatic) || ip2int(sInput) > ip2int(eStatic)){
                    flag = 0;
                }
            }else if(sInput.indexOf(":")>0 && sStatic.indexOf(":")>0) {
                if(ipv6AddrCompare(transitV6Ip(eInput),transitV6Ip(sStatic)) == 2 || ipv6AddrCompare(transitV6Ip(sInput),transitV6Ip(eStatic)) == 1){
                    flag = 0;
                }
            }else{
                flag = 0;
            }
            return flag;
        };
        var _checkRuleOverlap = function(){
            var startIp = $("#start_ip").val();
            var endIp = $("#end_ip").val();
            var mode = $('#rate_limit_mode').val();
            var direction = $("#rate_limit_direction").val();
            var flag = 0;
            var rules = direction === "up" ? upIpRule : downIpRule;

            if(mode != 3){
                return 0;
            }

            $.map(rules,function(rule,i){
                var ipPool = rule.split("/")[0];
                if(ipPool != ""){
                    var ipStartRule = ipPool.split("-")[0];
                    var ipEndRule = ipPool.split("-")[1];
                    if(checkOverlapIP(startIp,endIp,ipStartRule,ipEndRule)){
                        flag = 1;
                    }
                }
            });
            if(flag){
                alert($("#alert_rule_conflict").text());
                return 1;
            }
            return flag;
        }

        var _checkRuleOverload = function(){
            var direction = $("#rate_limit_direction").val();
            var mode = $('#rate_limit_mode').val();

            if(direction ==="up"){
                if((mode == 1 && upItfRule.length>=8)
                    || (mode == 3 && upIpRule.length>=8)){
                    alert($("#rule_overload").text());
                    return 1;
                }
            }else if(direction ==="down"){
                if((mode == 1 && downItfRule.length>=8)
                    || (mode == 3 && downIpRule.length>=8)){
                    alert($("#rule_overload").text());
                    return 1;
                }
            }
            return 0;
        }
        var _hasRule = function(info){
            if(info != "" && info.length>=1){
                return true;
            }
            return false;
        }
        var _checkRuleModeChanged = function(){
            var mode = $('#rate_limit_mode').val();
            var direction = $("#rate_limit_direction").val();
            if(direction ==="up"){
                if((mode == 3 && _hasRule(upItfRule))
                    || (mode == 1 && _hasRule(upIpRule))){
                    //alert($("#rule_mode_changed").text());
                    return true;
                }
            }else if(direction ==="down"){
                if((mode == 3 && _hasRule(downItfRule))
                    || (mode == 1 && _hasRule(downIpRule))){
                    //alert($("#rule_mode_changed").text());
                    return true;
                }
            }
            return false;
        }

        var _v6Hex2Bin = function(ip){
            /*var value="";
            for(var i=0;i<ip.length;i++){
                if(ip.charAt(i) == ":"){
                    continue;
                }else{
                    value = value + parseInt(ip.charAt(i)).toString(2);
                }
            }
            return value;*/
            var hex_array = [{key:0,val:"0000"},{key:1,val:"0001"},{key:2,val:"0010"},{key:3,val:"0011"},{key:4,val:"0100"},{key:5,val:"0101"},{key:6,val:"0110"},{key:7,val:"0111"},
                {key:8,val:"1000"},{key:9,val:"1001"},{key:'a',val:"1010"},{key:'b',val:"1011"},{key:'c',val:"1100"},{key:'d',val:"1101"},{key:'e',val:"1110"},{key:'f',val:"1111"}];
            var value="";
            for(var i=0;i<ip.length;i++){
                for(var j=0;j<hex_array.length;j++){
                    if(ip.charAt(i).toLowerCase()== hex_array[j].key){
                        value = value.concat(hex_array[j].val);
                        break;
                    }
                }
            }
            return value;
        }

        var _isSameSubnetIPv6 = function(){
            var startIp = $("#start_ip").val();
            var endIp = $("#end_ip").val();
            var prefix ="";
            var len;
            var preIp;

            if(typeof(_lanIfip.Prefix) !== 'undefined'){
                prefix = _lanIfip.Prefix
            }else if (typeof(_lanIfip.X_CT_COM_IPv6Prefix) !== 'undefined'){
                prefix = _lanIfip.X_CT_COM_IPv6Prefix;
            }
            /*if(typeof(prefix) == 'undefined'){//no prefix
                return true;
            }*/

            if(prefix == ""){//no prefix
                return true;
            }

            preIp = prefix.split("/")[0] + "0";
            len = prefix.split("/")[1];

            if(_v6Hex2Bin(transitV6Ip(preIp)).substring(0,len) != _v6Hex2Bin(transitV6Ip(startIp)).substring(0,len)){
                return false;
            }
            if(_v6Hex2Bin(transitV6Ip(preIp)).substring(0,len) != _v6Hex2Bin(transitV6Ip(endIp)).substring(0,len)){
                return false;
            }
            return true;
        }

        var _checkInputParamValid = function(){
            var startIp = $("#start_ip").val();
            var endIp = $("#end_ip").val();
            var rate = $("#rate").val();
            var mode = $('#rate_limit_mode').val();
            var itf = $("select[name='rate_limit_interface']").val();
            var direction = $("#rate_limit_direction").val();

            if(mode == 3){//ip pool mode
                if(startIp.indexOf(".")>0 || endIp.indexOf(".")>0) {
                    if(!isValidIpAddress(startIp) || !isValidIpAddress(endIp)) {
                        alert($("#invalid_ip").text());
                        return 1;
                    }
                    if((ip2int(startIp)&ip2int(_lanIfip.IPInterfaceSubnetMask))!=(ip2int(_lanIfip.IPInterfaceIPAddress)&ip2int(_lanIfip.IPInterfaceSubnetMask))){
                        alert($("#invalid_subnet").text());
                        return 1;
                    }
                    if((ip2int(endIp)&ip2int(_lanIfip.IPInterfaceSubnetMask))!=(ip2int(_lanIfip.IPInterfaceIPAddress)&ip2int(_lanIfip.IPInterfaceSubnetMask))){
                        alert($("#invalid_subnet").text());
                        return 1;
                    }
                    if(ip2int(startIp) > ip2int(endIp)){
                        alert($("#invalid_ip_pool_range").text());
                        return 1;
                    }
                }else if(startIp.indexOf(":")>0 || endIp.indexOf(":")>0) {
                    if (startIp.indexOf("/")>0 || endIp.indexOf("/")>0) {
                        alert($("#invalid_ip").text());
                        return 1;
                    }
                    if (!checkipv6(startIp) || !checkipv6(endIp)) {
                        alert($("#invalid_ip").text());
                        return 1;
                    }
                    if(!_isSameSubnetIPv6()){
                        alert($("#invalid_subnet").text());
                        return 1;
                    }
                    if(ipv6AddrCompare(transitV6Ip(startIp),transitV6Ip(endIp)) == 1){
                        alert($("#invalid_ip_pool_range").text());
                        return 1;
                    }
                }else{
                    alert($("#invalid_ip").text());
                    return 1;
                }
            }else if (mode == 1){//interface mode
                if(direction ==="up"){
                    if(_rateLimitRule.UpStreamInterfaceLimit.indexOf(itf)!= -1){
                        alert($("#interface_exists").text());
                        return 1; 
                    }
                }else if(direction ==="down"){
                    if(_rateLimitRule.DownStreamInterfaceLimit.indexOf(itf)!= -1){
                        alert($("#interface_exists").text());
                        return 1; 
                    }
                }
            }

            if(isNaN(parseInt(rate)) || parseInt(rate) != rate){
                alert($("#invalid_rate").text());
                return 1;
            }
            if (parseInt(rate) != parseFloat(rate)){
                alert($("#invalid_rate").text());
                return 1;
            }
            if(parseInt(rate) > 2048 || parseInt(rate) <= 0){
                alert($("#max_rate").text());
                return 1;
            }
            return 0;
        }
        var _isVlaidRate = function(rate){
            if(isNaN(parseInt(rate)) || parseInt(rate) != rate){
                return 0;
            }
            if (parseInt(rate) != parseFloat(rate)){
                return 0;
            }
            if(/*parseInt(rate) > 2048 ||*/ parseInt(rate) <= 0){
                return 0;
            }
            return 1;
        }
        var _getRealRate = function(rate){
            var realRate = rate*512;
            if(realRate < 1024){
                return realRate + "kbit/s";
            }else if(realRate >= 1024 && realRate < 1024*1024){
                return realRate/1024 + "Mbit/s";
            }else{
                return realRate/(1024*1024) + "Gbit/s";
            }
        }

        var _formSubmit = function (){
            var flag = 0;
            flag = _checkInputParamValid();
            if(flag == 1){
                return false;
            }
            flag = _checkRuleOverload();
            if(flag == 1){
                return false;
            }
            flag = _checkRuleOverlap();
            if(flag == 1){
                return false;
            }

            //this should be the lastest judgement
            flag = _checkRuleModeChanged();
            if(flag){
                if(!window.confirm($("#rule_mode_changed").text())){
                    return false;
                }
            }

            var postURL = window.location.pathname+"?add_limit_rule";
            var locURL = window.location.pathname;
            $.ajax({
                url: postURL,
                type: 'POST',
                data: $('form').serialize(),
            })
            .done(function(data){
                window.location.replace(locURL);
            })
            $('#save').prop("disabled", true);
        };
        var _addDeleteButton = function(id){
            $("a[id='"+id+"']").text($("#delete_button").text());
            $("a[id='"+id+"']").click(function(){
                if ($(this).prop("disabled")==true)
                {
                    return false;
                }
                $(this).prop("disabled", true);
            });
        }
        var _addTableData = function(){
            switch (_rateLimitRule.UpStreamSpeedLimitMode){
                case 0:
                    break;
                case 1:
                    $.map(upItfRule,function(rule,i){
                        var itf = rule.split("/")[0];
                        var itfRate = rule.split("/")[1];
                        if(itf != "" && itfRate != ""){
                            $("<tr></tr>")
                                .append($("<td>"+"Interface"+"</td>"))
                                .append($("<td>"+"Up"+"</td>"))
                                //.append($("<td>"+itfRate+"</td>"))
                                .append($("<td><div title='"+_getRealRate(itfRate)+"'>"+ itfRate +"</div></td>"))
                                .append($("<td>"+itf+"</td>"))
                                .append($("<td><a id='del_itf_up"+i+"' href='?act=del&mode=itf&direction=up&rule="+rule+"'></a></td>"))
                                .appendTo($("#content_list"));
                                _addDeleteButton("del_itf_up"+i);
                        }
                    });
                    break;
                case 3:
                    $.map(upIpRule,function(rule,i){
                        var ipPool = rule.split("/")[0];
                        var ipRate = rule.split("/")[1];
                        if(ipPool != "" && ipRate != ""){
                            $("<tr></tr>")
                                .append($("<td>"+"IP Pool"+"</td>"))
                                .append($("<td>"+"Up"+"</td>"))
                                //.append($("<td>"+ipRate+"</td>"))
                                .append($("<td><div title='"+_getRealRate(ipRate)+"'>"+ ipRate +"</div></td>"))
                                .append($("<td>"+ipPool+"</td>"))
                                .append($("<td><a id='del_ip_up"+i+"' href='?act=del&mode=ip&direction=up&rule="+rule+"'></a></td>"))
                                .appendTo($("#content_list"));
                                _addDeleteButton("del_ip_up"+i);
                        }
                    });
                    break;
                default:
                    break;
            }

            switch (_rateLimitRule.DownStreamSpeedLimitMode){
                case 0:
                    break;
                case 1:
                    $.map(downItfRule,function(rule,i){
                        var itf = rule.split("/")[0];
                        var itfRate = rule.split("/")[1];
                        if(itf != "" && itfRate != ""){
                            $("<tr></tr>")
                                .append($("<td>"+"Interface"+"</td>"))
                                .append($("<td>"+"Down"+"</td>"))
                                //.append($("<td>"+itfRate+"</td>"))
                                .append($("<td><div title='"+_getRealRate(itfRate)+"'>"+ itfRate +"</div></td>"))
                                .append($("<td>"+itf+"</td>"))
                                .append($("<td><a id='del_itf_down"+i+"' href='?act=del&mode=itf&direction=down&rule="+rule+"'></a></td>"))
                                .appendTo($("#content_list"));
                                _addDeleteButton("del_itf_down"+i);
                        }
                    });
                    break;
                case 3:
                    $.map(downIpRule,function(rule,i){
                        var ipPool = rule.split("/")[0];
                        var ipRate = rule.split("/")[1];
                        if(ipPool != "" && ipRate != ""){
                            $("<tr></tr>")
                                .append($("<td>"+"IP Pool"+"</td>"))
                                .append($("<td>"+"Down"+"</td>"))
                                //.append($("<td>"+ipRate+"</td>"))
                                .append($("<td><div title='"+_getRealRate(ipRate)+"'>"+ ipRate +"</div></td>"))
                                .append($("<td>"+ipPool+"</td>"))
                                .append($("<td><a id='del_ip_down"+i+"' href='?act=del&mode=ip&direction=down&rule="+rule+"'></a></td>"))
                                .appendTo($("#content_list"));
                                _addDeleteButton("del_ip_down"+i);
                        }
                    });
                    break;
                default:
                    break;
            }

        }
        var _refreshByLimitMode = function(){
            if($('#rate_limit_mode').val() == 1){//interface mode
                $(".ip_pool_setting").hide();
                $(".interface_setting").show();
            }else{
                $(".interface_setting").hide();
                $(".ip_pool_setting").show();
            }
        }
        var _addInitData = function(){
            _refreshByLimitMode();
            _addTableData();
        }
        var _addInterface = function(){
            $.fn.append.apply(
                $("select[name='rate_limit_interface']"),
                $.map(_wlanList, function(wlan, i) {
                    if (wlan && wlan.X_ASB_COM_routeMode != 1 && (_greLans.stringGWLAN.indexOf(wlan.Value) < 0)) {// do not show bridge wlan port
                        return $("<option/>").val(wlan.Value).html(wlan.Value);
                    }
                })
            );
            $.fn.append.apply(
                $("select[name='rate_limit_interface']"),
                $.map(_lanList, function(lan, i) {
                    if (lan && (_greLans.stringGLAN.indexOf(lan.Value) < 0)) {
                        var index = lan.Name.split('.');
                        var Name = "LAN" + i;
                        return $("<option/>").val(lan.Value).html(Name);
                    }
                })
            );

        }

        var _bindListener = function(){
            $('#rate_limit_mode').change(function(){
                _refreshByLimitMode();
            });
            /*if($.browser.mozilla){
            }*/
            $('#rate').bind("input propertychange",function(){
                var rate = $('#rate').val();
                if(_isVlaidRate(rate)){
                    $('#result').html(_getRealRate(rate));
                    $('#result').show();
                }else{
                    $('#result').hide();
                }
            })
            
            /*$("input[name='rate_limit_enable']").bind("click",function(){
                var curEnable = $(this).prop('checked') === true ? 1 : 0;
                //if (_portFilterConfig.Enable !== curEnable) {
                self.location.href="?act=switch&enable="+curEnable;
                //}
            });*/
            $('#save').bind("click",function(){
                _formSubmit();
            });

        }

        var _bodyRefresh = function(){
            var fHeight;
            if(isltIE(9)){
                fHeight = window.document.body.scrollHeight;
            }else if(getBrowser()=="Chrome" && $(".container").length == 1){
                fHeight = $(".container").height() + 50;
            }else if(getBrowser()=="IE" && $(".container").length == 1){
                fHeight = $(".container").height() + 50;
            }else{
                fHeight = document.documentElement.offsetHeight + 50;
            }
            var mainFrame = window.parent.document.getElementById("mainFrame");
            if (mainFrame === null)
                return;
            if (fHeight >= 500){
                mainFrame.style.height = fHeight + "px";
            }
        }

        return{
            constructor : function(){
                _self = this;
                _self.init();
                return this;
            },

            init : function(){
                _bindListener();
                _addInterface();
                _addInitData();
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }.constructor();
    };
});