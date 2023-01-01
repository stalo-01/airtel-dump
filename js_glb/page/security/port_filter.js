define([], function () {

    return function (portFilterConfig,portFilterList,tr181) {
        var _portFilterConfig = portFilterConfig;
        var _portFilterList = portFilterList;
        var _tr181 = tr181;
        var ruleCheckedError = {
            success : 0,
            duplicate : 1,
            conflict : 2,
        };

        var validPortNum = function(portNumStr){
            tstr=portNumStr.trim()
            if(tstr=="") return false;
            if(!(/^\d{1,5}$/.test(tstr))) return false;
            var portNum = parseInt(tstr);
            return (portNum<=65535&&portNum>0)
        };
        var check_input_param_valid=function()
        {
            var flag = 0;
            var protocol=$("select[name='protocol']").val();
            var portfltmode=$("select[name='port_filter_mode']").val();
            var srcportstart=$("input[name='source_portnum']").val();
            var srcportend=$("input[name='source_eportnum']").val();
            var dstportstart=$("input[name='destination_portnum']").val();
            var dstportend=$("input[name='destination_eportnum']").val();

            if(srcportstart.trim() == "" && srcportend.trim() == "" && dstportstart.trim() == ""&& dstportend.trim() == ""){
                alert($("#alert_port_wrong").text()); 
                flag = 1;
                return flag;
            }
            if(srcportstart.trim() == ""){
                srcportstart = "1";
                $("input[name='source_portnum']").val(1);
            }
            if(srcportend.trim() == ""){
                srcportend = "65535";
                $("input[name='source_eportnum']").val(65535);
            }
            if(dstportstart.trim() == ""){
                dstportstart = "1";
                $("input[name='destination_portnum']").val(1);
            }
            if(dstportend.trim() == ""){
                dstportend = "65535";
                $("input[name='destination_eportnum']").val(65535);
            }
            if(!validPortNum(srcportstart) || !validPortNum(srcportend) || !validPortNum(dstportstart) || !validPortNum(dstportend)){
                alert($("#alert_port_wrong").text()); 
                flag = 1;
                return flag;
            }
            if( parseInt(srcportstart) > parseInt(srcportend) || 
                 parseInt(dstportstart) > parseInt(dstportend) ){
                //alert($("#alert_port_smaller").text().replace(/^\s+|\s+$/gm,''));//another way to remove the blank when get the text from div
                alert($("#alert_port_smaller").text());
                flag = 1;
                return flag;
            }
            return flag;
        };
           
        var check_portfilter_rule = function()
        {
            var protocol=$("select[name='protocol']").val();
            var portfltmode=$("select[name='port_filter_mode']").val();
            var srcportstart=$("input[name='source_portnum']").val();
            var srcportend=$("input[name='source_eportnum']").val();
            var dstportstart=$("input[name='destination_portnum']").val();
            var dstportend=$("input[name='destination_eportnum']").val();
            var flag = ruleCheckedError.success;

            var length = _portFilterList.length;
            var i = 0;
            for(i = 0;i< length;i++) 
            {
                if(_portFilterList[i].X_ASB_COM_FunctionMark != 2)
                {
                    continue;
                }
                var modeValue = filterModeValue(_portFilterList[i]);//mode in DB
                if(protocol == _portFilterList[i].X_ASB_COM_AppName)
                { 
                    if(srcportstart == _portFilterList[i].SourcePort && srcportend == _portFilterList[i].SourcePortRangeMax
                     && dstportstart == _portFilterList[i].DestPort && dstportend == _portFilterList[i].DestPortRangeMax )
                    {
                        if(portfltmode == modeValue 
                            || (portfltmode == "WANblack" || portfltmode == "WANwhite" )&& _portFilterList[i].DestInterface == "WAN"
                            ||(portfltmode == "LANblack" || portfltmode == "LANwhite" )&& _portFilterList[i].DestInterface == "LAN")
                        {
                            flag = ruleCheckedError.duplicate;
                            break;
                        }
                    }
                    var prePortFltMode = portfltmode.substring(0, 3);
                    var preModeValue = modeValue.substring(0, 3);
                    if(portfltmode != modeValue && prePortFltMode == preModeValue){
                        if(check_overlap_port(srcportstart,srcportend,_portFilterList[i].SourcePort,_portFilterList[i].SourcePortRangeMax)
                            && check_overlap_port(dstportstart,dstportend,_portFilterList[i].DestPort,_portFilterList[i].DestPortRangeMax)){
                            flag = ruleCheckedError.conflict;
                            break;
                        }
                    }
                }
            }
            return flag;
        };
        
        var check_overlap_port = function(sInput,eInput,sStatic,eStatic){
            var flag = 1;//has overlap port as default
            if(eInput < sStatic || sInput > eStatic){
                flag = 0;
            }
            return flag;
        };

        var protocol = function (appname){
            var id;
            if(appname == 0)
            {
                id = "ALL";
            }
            else if(appname== 1)
            {
                id = "TCP";
            }
            else if(appname == 2)
            {   
                id = "UDP";
            }
            else   //get data from protcol.js
            {
                appname=appname-5;
                id = ProtocolList[appname][0]; 
            }
            return id;
        };
        var filterModeValue = function (pm) {
            var mode;
            if(pm.DestInterface=="LAN") //downstream
            {
                if(pm.Target=="Drop")
                {
                    mode = "LANblack";
                }
                else
                {
                   mode = "LANwhite";
                }
               
            }
            else
            {
                if(pm.Target=="Drop")
                {
                    mode = "WANblack";
                }
                else
                {
                    mode = "WANwhite";
                }
            }
            return mode;
        };
        var filterMode = function (pm) {
            var mode;
            if(pm.DestInterface=="LAN") //downstream
            {
                if(pm.Target=="Drop")
                {
                    mode = $("#info_drop_downstream").text();
                }
                else
                {
                   mode = $("#info_accept_downstream").text();
                }
               
            }
            else
            {
                if(pm.Target=="Drop")
                {
                    mode = $("#info_drop_upstream").text();
                }
                else
                {
                    mode = $("#info_accept_upstream").text();
                }
            }
            return mode;
        };

        var _formSubmit = function (){
            var YMDHMS="";
            var flag = 0;
            flag = check_input_param_valid();
            if(flag == 1)
            {
                return false;
            }
            
            if(_tr181.X_ASB_COM_TR181Enabled){
                if(fireWallConfig.Config != 'Advanced'){
                    alert("The rule can't be added !The firewall level isn't Advanced.");
                    return false;
                }
            }
            with(new Date()){
                YMDHMS = "d_" + getFullYear() + "_" + (getMonth()+1) + "_" + getDate() ;
                YMDHMS += "_t_" + getHours() + "_" + getMinutes() + "_" + getSeconds() ;
            }
            $("input[name='filter_name']").val(YMDHMS);

            flag = check_portfilter_rule();
            if(flag == ruleCheckedError.duplicate)
            {
                //alert("The rule already exists or the black/white rule has been set on port!");
                alert($("#alert_rule_repeat").text());
                return false;
            }else if(flag == ruleCheckedError.conflict){
                alert($("#alert_rule_conflict").text());
                return false;
            }
            if(_portFilterList.length >= 100)
            {
                alert($("#port_rule_limit").text());
                return false;
            }
            
            var postURL = window.location.pathname+"?add_glb";
            var locURL = window.location.pathname;
            $.ajax({
                url: postURL,
                type: 'POST',
                data: $('form').serialize(),
            })
            .done(function(data){
                var result= "";
                result = data;
               if((result.indexOf("<script>alert")!=-1) &&  
			 	      (result.indexOf("<html>")==-1))  
               {
                   document.write(result);
               }else if(((result.indexOf("error")!=-1) 
                    ||  (result.indexOf("Failed")!=-1)
            	    ||  (result.indexOf("can not")!=-1))
            	    &&  (result.indexOf("<html>")==-1))
                {
                    alert(data);
                } 
                window.location.replace(locURL);
            })
            disable_all_buttons();
        };
    
        var _refresh = function ()
        {
            window.location.replace(location.protocol + '//' + location.host + location.pathname);
        };

        var _loadData = function(){
            $("input[name='port_filter_enable']").prop({ "checked":_portFilterConfig.Enable });
            
            var tb=$("#content_list");
            $.each(_portFilterList,function(i,pm){
                var flag = 0;// The rule is not for portFilter
                var appname=(pm.X_ASB_COM_AppName)?parseInt(pm.X_ASB_COM_AppName):'';
                if(pm.X_ASB_COM_FunctionMark == 2){
                    flag = 1;
                }
                var ssp = pm.SourcePort;//source start port
                var sep = pm.SourcePortRangeMax;//source end port
                var dsp = pm.DestPort;//destination start port
                var dep = pm.DestPortRangeMax;//destination end port
                if(flag){
                    $("<tr></tr>")
                    .append($("<td>"+filterMode(pm)+"</td>"))
                    .append($("<td>"+protocol(appname)+"</td>"))
                    .append($("<td>"+ssp+"</td>"))
                    .append($("<td>"+sep+"</td>"))
                    .append($("<td>"+dsp+"</td>"))
                    .append($("<td>"+dep+"</td>"))
                    .append($("<td><a id='del"+i+"' href='?v_glb=delfilter&id="+pm._oid+","+pm.X_ASB_COM_AppName+","+pm.DestInterface+","+pm.SourcePort+","+pm.DestPort+","+pm.Target+"'></a></td>"))
                    .appendTo(tb);
                    $("a[id='del"+i+"']").text($("#delete_button").text());
                    $("a[id='del"+i+"']").click(function(){
                        if ($(this).prop("disabled")==true)
                        {
                            return false;
                        }
                        $(this).prop("disabled", true);
                    })
                }
            })
        };
        var _handleModeChanged = function () {
            $("input[name='port_filter_enable']").bind("click",function(){
                var curEnable = $(this).prop('checked') === true ? 1 : 0;
                if (_portFilterConfig.Enable !== curEnable) {
                    self.location.href="?v_glb=set&port_filter_enable="+curEnable;
                }
            });
        };
        var _bindFormButton = function(){
            $('#save').bind("click",function(){
            //InputManager.bindClick('#save', function () {
                _formSubmit();
            });
            $('#refresh').bind("click",function(){
            //InputManager.bindClick('#refresh', function () {
                _refresh();
            });
        }
        
        var _bindListener = function(){
            _bindFormButton();
            _handleModeChanged();
        };
        /* Because of the require.js is imported , HTML will be created before running the js.
        The body's height is definded before table created,so after create the table, the form add it's own scroll bar.
        There will be tow scroll bars !
        when the page is loaded completed, refresh the height 
        */
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
                _loadData();
                $(document).ready(function () {
                    _bodyRefresh();

                });
            }
        }.constructor();
    };
});