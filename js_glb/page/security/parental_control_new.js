define([], function () {

    return function (parentalCtrlList,deviceCfg,pcVersion) {
        // the main action of new version of parental control will be end of _N
        var _parentalCtrlList = parentalCtrlList;
        var _parentalCtrlGroupList = parentalCtrlList.NPCProfileList;
        var _deviceCfg = deviceCfg;
        var _pcVersion = pcVersion;
        var _bodyShow;
        var _bodyShowID;
        var _dayList = ["Su","Mo","Tu","We","Th","Fr","Sa"];

        var _validName = function(name){
          var patt = /^.{1,128}$/;
          if(!patt.test(name))
          {
              return false;
          }
          if(unescape(encodeURIComponent(name)).length > 128){
              return false;
          }
          return true;
        }

        var _isUniqueGroupName = function(name,id){
            var flag = false;
            $.map(_parentalCtrlGroupList, function (group, i){
                if(id == null){
                    if(name == group.Name){
                        flag = true;
                    }
                }else{
                    if(id != group._oid && name == group.Name){
                        flag = true;
                    }
                }
            })
            return flag;
        }

        var _isUniqueDevice = function(mac){
            var flag = true;
            $.map(_parentalCtrlGroupList, function (group, i){
                var devices = _parentalCtrlGroupList[i].Device;
                $.map(devices, function (device, i){
                    if(device.MACAddress.toString().toLowerCase() == mac.toString().toLowerCase() && !group.HomeGroup){
                        flag = false;
                    }
                })
            })
            return flag;
        }

        var _isDeviceFull = function(){
            var deviceNum = 0;
            $.map(_parentalCtrlGroupList, function (group, i){
                deviceNum = deviceNum + group.DeviceNumberOfEntries
            })
            if(deviceNum >= 254){
                return true;
            }
            return false;
        }

        var _isLanDevice = function(mac){
            var flag = false;
            $.map(_deviceCfg, function (host, i){
                if(mac.toString().toLowerCase() == host.MACAddress.toString().toLowerCase()) {
                    flag = true;
                }
            })
            return flag;
        }

        var _fromHome = function(groupID){
            var flag = false;
            $.map(_parentalCtrlGroupList, function(group, i) {
                if(groupID == group._oid && group.HomeGroup){
                    flag = true;
                }
            })
            return flag;
        }

        var _validMacAddress = function(macStr){
            valid_macaddr=/^([0-9a-f]{2}([:]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
            if (valid_macaddr.test(macStr) && macStr.length == 17){
                return true;
            }
            else{
                return false;
            }
        }

        var _getDisplayString = function(clue,type){
            var result ="";
            $.map(_deviceCfg, function (host, i){
                if(clue.toString().toLowerCase() == host.MACAddress.toString().toLowerCase()) {
                    if(type == "name"){
                        result = host.HostName;
                    }else if (type == "status"){
                        result = host.Active;
                    }
                }
            })
            /*if (!$.isEmptyObject(_deviceCfg)) {
                for (j in _deviceCfg) {
                    if(clue == _deviceCfg[j].MACAddress) {
                        if(type == "name"){
                            result = _deviceCfg[j].HostName;
                        }else if (type == "status"){
                            result = _deviceCfg[j].Active;
                        }
                    }
                }
            }*/
            return result;
        }

        var _validFqdnUrl = function(urlStr){
            var tstr=urlStr.trim();
            if(tstr.indexOf("-") == 0){
                return false;
            }
            var pattern = /^(?=.*[a-zA-Z])[0-9a-zA-Z-.]{1,254}$/;
            if(pattern.test(tstr)){
                return true;
            }
            return false;
        }

        var _isValidTime = function(){
            var start = formatTime($("#group_scd_start_time").val());
            var end = formatTime($("#group_scd_end_time").val());
            if (start == null || end == null) {
                return false;
            }
            return true;
        }

        var _clearStorage = function(){
            sessionStorage.removeItem("parental_control_sub_table");
            sessionStorage.removeItem("parental_control_sub_table_id");
            _bodyShow = "";
            _bodyShowID = "";
        };

        var _addGroupChecker = function(){
            var groupName = $("form[name='add_group']").find("input[name='group_name_input']").val();
            if(_parentalCtrlGroupList.length >= 64){
                alert($("#group_num_overload").text());
                return false;
            }
            if(!_validName(groupName)){
                alert($("#group_name_invalid").text());
                return false;
            }
            if(_isUniqueGroupName(groupName,null)){
                alert($("#group_name_exist").text());
                return false;
            }
            return true;
        };

        var _bindGroupAddButton = function(){
            $("form[name='add_group']").submit(function(){
                var flag = _addGroupChecker();
                if(!flag){
                    return flag;
                }
                _clearStorage();
                _showSpecifiedArea();
                $("#submit_add_group").prop("disabled",true);
                //$("#submit_add_group").attr("disabled","true");
            })
        };
        var _bindGroupAddModalInit= function(){
            $("#add_group_symbol").click(function() {
                //$("form[name='add_group']").find("input[name='group_name_input']").val("");
                $("form[name='add_group']")[0].reset();
                $("#submit_add_group").prop("disabled",false);
            })
        }

        var _bindBackToOldButton = function(){
            $('#back_button').bind("click",function(){
                var confirm = window.confirm($("#back_alert").text());
                if(confirm == true){
                    var postData = "version=OLD";
                    $.post(location.pathname + "?chg_version_N", postData).done(function(a) {
                        refresh();
                    });
                    _clearStorage();
                }else{
                    return false;
                }
            });
        };
        var _bindGroupNameChangedButton = function(){
            $("#change_group_name").submit(function(event){
                var groupName = $("#change_group_name").find("input[name='group_name_input']").val();
                var groupID = $("#change_group_name").find("input[name='group_id_name']").val();
                if(!_validName(groupName)){
                    alert($("#group_name_invalid").text());
                    return false;
                }
                if(_isUniqueGroupName(groupName,groupID)){
                    alert($("#group_name_exist").text());
                    return false;
                }
            })
        };

        var _bindDeviceMoveListener = function(){
            var deviceGID = $("input[name='group_id_device']").val();

            $("#device_list").find(".device_tb_move").click(function() {
                var id = $(this).attr("id").replace("device_tb_move_","");
                var mac = $(this).data("obj").MACAddress;
                var isLanDevice = _isLanDevice(mac);
                /*$.map(_deviceCfg, function (host, i){
                    if(mac.toString().toLowerCase() == host.MACAddress.toString().toLowerCase()) {
                        isLanDevice = true;
                    }
                })*/

                $("select[name='device_move']").empty();
                $.fn.append.apply(
                    $("select[name='device_move']"),
                    $.map(_parentalCtrlGroupList, function(group, i) {
                        if(deviceGID != group._oid){
                            if(isLanDevice || !group.HomeGroup){
                                return $("<option/>").val(group._oid).html(group.Name);
                            }
                        }
                    })
                );
                $('#submit_device_move').unbind('click').bind("click",function(){
                    var moveId = $("select[name='device_move']").val();
                    if(_isDeviceFull() && _fromHome(deviceGID)){
                        alert($("#device_num_overload_move").text());
                        return false;
                    }
                    var postData = "move_id=" + moveId + "&device_id=" + id + "&group_id=" + deviceGID;
                    $.post(location.pathname + "?move_device_N", postData).done(function(a) {
                        refresh();
                    });
                });
            })
        }

        var _bindDeviceDelListener = function(){
            var deviceGID = $("input[name='group_id_device']").val();
            $("#device_list").find(".device_tb_del").click(function() {
                var id = $(this).attr("id").replace("device_tb_del_","");
                var postData = "device_id=" + id + "&group_id=" + deviceGID;
                $.post(location.pathname + "?del_device_N", postData).done(function(a) {
                    refresh();
                });
            })

        }
        var _bindDeviceAddListener = function(){
            $("#add_device").submit(function(event){
                var deviceGID = $("input[name='group_id_device']").val();
                var mac = $("#add_device_mac").val().trim();
                if(!_validMacAddress(mac)){
                    alert($("#invalid_mac").text());
                    return false;
                }
                if(!_isUniqueDevice(mac)){
                    alert($("#device_exist").text());
                    return false;
                }
                if(_isDeviceFull()){
                    if(_isLanDevice(mac)){
                        alert($("#device_num_overload_move").text());
                    }else{
                        alert($("#device_num_overload").text());
                    }
                    return false;
                }
            })
        }

        var _bindUrlEnableListener = function(){
            $("input[name='group_url_en']").bind("click",function(){
                var id = $("input[name='group_id_url']").val();
                var en = $(this).prop("checked") ? 1 : 0;
                var postData = "group_id_url=" + id + "&url_en=" + en;

                $.post(location.pathname + "?enable_url_N", postData).done(function(a) {
                    refresh();
                });
                $("input[name='group_url_en']").prop("disabled",true);
                $("input[id='group_url_input']").prop("disabled",true);
            });
        }

        var _bindAddUrlListener = function(){
            $("#add_url").submit(function(event){
                var address = $("#group_url_input").val().trim();
                if(!address){
                    alert($("#empty_url").text());
                    return false;
                }
                var urlhead = address.split('://');
                if(urlhead.length > 1){
                    alert($("#invalid_url_with_head").text());
                    return false;
                }
                if(!_validFqdnUrl(address) && !checkipv6(address) && !isValidIpAddress(address)){
                    alert($("#invalid_url").text());
                    return false;
                }
                var id = $("input[name='group_id_url']").val();
                var index = _getGroupIndexByOid(id);
                if(typeof(index) == "undefined"){
                    return false;
                }
                var urlData = _parentalCtrlGroupList[index].UrlFilter[0].UrlAddress;
                var flag = false;
                $.map(urlData, function (url, i){
                    if(url.Address == address){
                        flag = true;
                    }
                });
                if(flag){
                    alert($("#url_exist").text());
                    return false;
                }
                if(_parentalCtrlGroupList[index]._GlobalUrlNumberofEntries >= 128){
                    alert($("#url_num_overload").text());
                    return false;
                }
                $("#group_url_save").prop("disabled",true);
            })
        }

        var _bindGroupInternetChangedButton = function(){
            $("input[name='group_access_internet_input']").bind("click",function(){
                var internetEnable = $("input[name='group_access_internet_input']").prop("checked") ? 1 : 0;
                var groupID = $("input[name='group_id_access_internet']").val();
                var index = _getGroupIndexByOid(groupID);
                if(typeof(index) == "undefined"){
                    return;
                }

                if( _parentalCtrlGroupList[index].AccessInternet == internetEnable){
                    return;
                }

                $('#group_access_internet_input').prop("disabled", true);

                var postData = "enable=" + internetEnable +"&group_id=" + groupID;
                $.post(location.pathname + "?chg_internet_N", postData).done(function(a) {
                    refresh();
                });
            })
        };

        var _bindGroupScdSubmitButton = function(){
            $("#add_scd").submit(function(event){
                var scdName = $("input[name='group_scd_name_input']").val();
                var id = $("input[name='group_id_scd']").val();
                var isBed = $("input[name='isbed']").val();
                var index = _getGroupIndexByOid(id);
                if(typeof(index) == "undefined"){
                    return false;
                }
                var scdData = _parentalCtrlGroupList[index].Schedule;
                var nameExist = false;
                var bedCnt = 0;
                var bedDayExist = false;
                var ruleExist = false;
                var days = _getDayOfWeek();
                $.map(scdData, function (scd, i){
                    if(scd.Name == scdName){
                        nameExist = true;
                    }
                    if(scd.IsBedtime){
                        bedCnt++;
                    }
                    if(scd.IsBedtime && _isBedDayExist(scd.DayOfWeek)){
                        bedDayExist = true;
                    }
                    if(!scd.IsBedtime && _isSameScd(scd)){
                        ruleExist = true;
                    }
                });

                if(_parentalCtrlGroupList[index].ScheduleTimeNumberOfEntries >= 32){
                    alert($("#scd_num_overload").text());
                    return false;
                }
                if(isBed == 1 && bedCnt >= 7){
                    alert($("#scd_bed_num_overload").text());
                    return false;
                }
                if(!_validName(scdName)){
                    if(isBed == 1){
                        alert($("#bed_name_name_invalid").text());
                    }else{
                        alert($("#scd_name_name_invalid").text());
                    }
                    return false;
                }
                if(nameExist && isBed != 1){
                    alert($("#scd_name_exist").text());
                    return false;
                }
                if(ruleExist && isBed != 1){
                    alert($("#scd_exist").text());
                    return false;
                }
                if(nameExist && isBed == 1){
                    alert($("#bed_time_name_exist").text());
                    return false;
                }
                if(!days){
                    alert($("#scd_days_empty").text());
                    return false;
                }
                if(!_isValidTime()){
                    alert($("#invalid_scd_time").text());
                    return false;
                }
                if(isBed == 1 && bedDayExist){
                    alert($("#scd_bed_day_overload").text());
                    return false;
                }
                $("#day_of_week").val(days);
                return true;
            })
        };

        var _bindListener = function(){
            _bindGroupAddModalInit();
            _bindGroupAddButton();
            _bindBackToOldButton();
            _bindGroupNameChangedButton();
            _bindGroupInternetChangedButton();
            _bindDeviceAddListener();
            //_bindDeviceMoveListener();
            _bindUrlEnableListener();
            _bindAddUrlListener();
            _bindGroupScdSubmitButton();
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
        };

        //var _addEnableButton = function(id,status){
        var _addEnableButton = function(id){
            //if status is enable, the title of button is disable
            //$("a[name='"+id+"']").text(status ? $("#disable").text() : $("#enable").text());
            $("a[name='"+id+"']").text($("#on_off").text());

            $("a[name='"+id+"']").click(function(){
                if ($(this).prop("disabled")==true)
                {
                    return false;
                }
                $(this).prop("disabled", true);
            });
        };

        var _addInputButtonTitle = function(id,type,needDisable){
            if(type == "move"){
                $("input[id='"+id+"']").val($("#move_button").text());
            }else if(type == "del"){
                $("input[id='"+id+"']").val($("#delete_button").text());
            }else if(type == "add"){
                $("input[id='"+id+"']").val($("#add_button").text());
            }

            if(needDisable){
                $("input[id='"+id+"']").click(function(){
                    if ($(this).prop("disabled")==true)
                    {
                        return false;
                    }
                    $(this).prop("disabled", true);
                });
            }
        };

        var _addDeviceData = function(id){
            var deviceList = $("#device_list");
            var index = _getGroupIndexByOid(id);
            if(typeof(index) == "undefined"){
                return;
            }
            var deviceData = _parentalCtrlGroupList[index].Device;
            deviceList.empty();

            $.map(deviceData, function (device, i){
                var deviceName = _getDisplayString(device.MACAddress, "name");
                var deviceStatus = _getDisplayString(device.MACAddress, "status");
                deviceList.append(
                    $("<tr/>").append(
                        $("<td/>").html(deviceName != "" ? deviceName : device.MACAddress),
                        $("<td/>").html(device.MACAddress),
                        $("<td/>").html(deviceStatus == 1 ? "Active":"Inactive"),
                        $("<td/>").append(
                            $("<input type='button' style='width:75%' class='buttonX device_tb_move' id='"+ 'device_tb_move_' + device._oid +"' data-toggle='modal' data-target='#deviceMoveModal' data-placement='bottom'/>").data("obj", device)
                        ),
                        $("<td class='device_del' />").append(
                            $("<input type='button' style='width:75%' class='buttonX device_tb_del' id='"+ 'device_tb_del_' + device._oid +"'/>")
                        )
                    )
                );
                _addInputButtonTitle("device_tb_move_"+device._oid,"move",false);
                _addInputButtonTitle("device_tb_del_"+device._oid,"del",true);
            })
            if(_parentalCtrlGroupList.length <= 1){
                $("#device_list").find(".device_tb_move").prop("disabled",true);
            }else{
                $("#device_list").find(".device_tb_move").prop("disabled",false);
            }
            if(_parentalCtrlGroupList[index].HomeGroup){
                $("#device_table").find(".device_del").hide();
                $("#add_device").hide();
            }else{
                $("#device_table").find(".device_del").show();
                $("#add_device").show();
                _bindDeviceDelListener();
            }
            _bindDeviceMoveListener();
        };

        var _setInternetStatus = function(id){
            var index = _getGroupIndexByOid(id);
            if(typeof(index) == "undefined"){
                return;
            }
            var internet = _parentalCtrlGroupList[index].AccessInternet;
            $("input[name='group_access_internet_input']").set_checked(internet ? true : false);
        };

        var _addUrlData = function(id){
            var urlList = $("#url_list");
            var index = _getGroupIndexByOid(id);
            if(typeof(index) == "undefined"){
                return;
            }
            var urlData = _parentalCtrlGroupList[index].UrlFilter[0].UrlAddress;
            var urlConf = _parentalCtrlGroupList[index].UrlFilter[0];
            $("input[name='group_url_en']").set_checked(urlConf.UrlFilterEnable ? true : false);
            //$("input[name='group_url_exclude_mode']").prop("checked",function(){return this.value==urlConf.UrlFilterMode;})

            urlList.empty();
            $.map(urlData, function (url, i){
                var status = urlConf.UrlFilterEnable ? "On" : "Off";
                urlList.append(
                $("<tr></tr>")
                .append($("<td>" + status + "</td>"))
                .append($("<td>" + url.Address + "</td>"))
                //.append($("<td> Block </td>"))
                .append($("<td><a id='url_tb_delete' href='?act=del_url_N&gid="+id+"&urlId=" + url._oid +"'></a></td>"))
                );
            });
            _addDeleteButton("url_tb_delete");
        }

        var _isBedDayExist = function(days){
            var exist = false;
            $("#group_scd_select_days").children().each(function(index) {
                if ($(this).children().is(":checked") && days.indexOf(index) != -1) {
                    exist = true;
                }
            });
            return exist;
        }

        var _isSameScd = function(scd){
            var dayExist = false;
            var timeExist = false;
            $("#group_scd_select_days").children().each(function(index) {
                if ($(this).children().is(":checked") && scd.DayOfWeek.indexOf(index) != -1) {
                    dayExist = true;
                }
            });

            var start = formatTime($("#group_scd_start_time").val());
            var end = formatTime($("#group_scd_end_time").val());
            if(start.indexOf("0") == 0 ){
                start = start.substr(1);
            }
            if(end.indexOf("0") == 0 ){
                end = end.substr(1);
            }
            if(scd.StartTime == start && scd.EndTime == end){
                timeExist = true;
            }

            return timeExist && dayExist;
        }

        var _getGroupIndexByOid = function(oid){
            var index;
            $.map(_parentalCtrlGroupList, function (group, i){
                if(oid == group._oid){
                    index = i;
                    return;
                }
            })
            return index;
        }

        var _getDayOfWeek = function(){
            var dayOfWeek = "";
            //var daliy = ($("select[name='time_pattern']").val() == "everyday") ? true : false;

            //if (daliy == true) {
            //    data.dayOfWeek = "0,1,2,3,4,5,6";
            //} else {
            $("#group_scd_select_days").children().each(function(index) {
                if ($(this).children().is(":checked") == true) {
                    dayOfWeek += index + ",";
                }
            });
            dayOfWeek = dayOfWeek.substring(0, dayOfWeek.length - 1);
            //}
            return dayOfWeek;
        }

        var _addScdData = function(id,isBed){
            var scdList = $("#scd_list");
            var index = _getGroupIndexByOid(id);
            if(typeof(index) == "undefined"){
                return;
            }
            var scdData = _parentalCtrlGroupList[index].Schedule;
            $('#group_scd_start_time').timepicker({
                minuteStep: 5,
                showInputs: false,
                disableFocus: true,
                defaultTime: false,
                showMeridian: false
            });

            $('#group_scd_end_time').timepicker({
                minuteStep: 5,
                showInputs: false,
                disableFocus: true,
                defaultTime: false,
                showMeridian: false
            });
            scdList.empty();

            $.map(scdData, function (scd, i){
                if(isBed && scd.IsBedtime != 1){
                    return;
                }
                if(!isBed && scd.IsBedtime != 0){
                    return;
                }
                var status = scd.Enable ? "On" : "Off";
                var day = "";
                $.map(scd.DayOfWeek.split(','),function(tmpDay,i){
                    day += _dayList[tmpDay] + ",";
                });
                day = day.substring(0, day.length - 1);
                scdList.append(
                    $("<tr></tr>")
                    .append($("<td>" + scd.Name + "</td>"))
                    .append($("<td>" + status + "</td>"))
                    .append($("<td>" + scd.StartTime + "</td>"))
                    .append($("<td>" + scd.EndTime + "</td>"))
                    .append($("<td>" + day + "</td>"))
                    .append($("<td><a id='scd_tb_enable"+id+"' name='scd_tb_enable_"+ id +"_scdid"+scd._oid+"' href='?act=enable_scd_N&gid="+id+"&scdId=" + scd._oid +"&en=" + scd.Enable +"'></a></td>"))
                    .append($("<td><a id='scd_tb_delete"+id+"' href='?act=del_scd_N&gid="+id+"&scdId=" + scd._oid +"'></a></td>"))
                );
                //_addEnableButton("scd_tb_enable_"+id+"_scdid"+scd._oid,scd.Enable);
                _addEnableButton("scd_tb_enable_"+id+"_scdid"+scd._oid);
            });
            _addDeleteButton("scd_tb_delete"+id);
        }

        var _clearInputArea = function(){
            $("#change_group_name")[0].reset();
            $("#add_device")[0].reset();
            $("#add_url")[0].reset();
            $("#add_scd")[0].reset();
        }

        var _showSpecifiedArea = function(){
            if(typeof(_bodyShow) == "undefined" || _bodyShow == null
                || typeof(_bodyShowID) == "undefined" || _bodyShowID == null){
                return;
            }
            if(typeof(_getGroupIndexByOid(_bodyShowID)) == 'undefined'){
                _clearStorage();
                return;
            }
            $(".group_detail").hide();
            switch (_bodyShow){
                case "name":
                    $("input[name='group_id_name']").val(_bodyShowID);
                    $(".group_name").show();
                    break;
                case "device":
                    $("input[name='group_id_device']").val(_bodyShowID);
                    _addDeviceData(_bodyShowID);
                    $(".group_device").show();
                    break;
                case "internet":
                    $("input[name='group_id_access_internet']").val(_bodyShowID);
                    _setInternetStatus(_bodyShowID);
                    $(".group_access_internet").show();
                    break;
                case "url":
                    $("input[name='group_id_url']").val(_bodyShowID);
                    _addUrlData(_bodyShowID);
                    $(".group_url").show();
                    break;
                case "shd":
                    $("input[name='group_id_scd']").val(_bodyShowID);
                    $("input[name='isbed']").val(0);
                    _addScdData(_bodyShowID,false);
                    $(".bed_title").hide();
                    $(".scd_title").show();
                    $(".group_scd").show();
                    break;
                case "bed":
                    $("input[name='group_id_scd']").val(_bodyShowID);
                    $("input[name='isbed']").val(1);
                    _addScdData(_bodyShowID,true);
                    $(".scd_title").hide();
                    $(".bed_title").show();
                    $(".group_scd").show();
                    break;
                default:
                    break;
            }
            _showGroupNameTitle(_bodyShowID);
            $(document).ready(function () {
                _bodyRefresh();
            });
        };

        var _loadSubMenu = function(){
            if (typeof(Storage) != "undefined"){
                _bodyShow = sessionStorage.getItem("parental_control_sub_table");
                _bodyShowID = sessionStorage.getItem("parental_control_sub_table_id");
                _showSpecifiedArea();
                sessionStorage.clear();
            }
        }

        var _loadWindow = function(){
            // this function allows to get the preivous web view & retain it on every page load
            /*$(document).ready(function() {
                if (typeof(Storage) != "undefined"){
                    _bodyShow = sessionStorage.getItem("parental_control_sub_table");
                    _bodyShowID = sessionStorage.getItem("parental_control_sub_table_id");
                    _showSpecifiedArea();
                    sessionStorage.clear();
                }
            });*/
            window.onbeforeunload = function() {
                if (typeof(Storage) != "undefined"){
                    sessionStorage.setItem("parental_control_sub_table",_bodyShow);
                    sessionStorage.setItem("parental_control_sub_table_id",_bodyShowID);
                }
            }
        }

        var _showGroupNameTitle = function(id){
            if(typeof(id) == 'undefined'){
                return;
            }
            var index = _getGroupIndexByOid(id);
            if(typeof(index) == 'undefined'){
                return;
            }
            $("#group_detail_title").text(_parentalCtrlGroupList[index].Name);
            $(".group_title").show();
        }

        var _showAndHideGroupName = function(id){
            if(id == $("input[name='group_id_name']").val() && ($(".group_name").is(":visible"))){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_name']").val(id);
                _bodyShow = "name";
                _bodyShowID = id;
                //show the initial data
                $(".group_detail").hide();
                $(".group_name").show();
                _showGroupNameTitle(id);
            }
        }

        var _showAndHideDevices = function(id){
            if(id == $("input[name='group_id_device']").val() && ($(".group_device").is(":visible"))){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_device']").val(id);
                _bodyShow = "device";
                _bodyShowID = id;
                //show the initial data
                _addDeviceData(id);
                $(".group_detail").hide();
                $(".group_device").show();
                _showGroupNameTitle(id);
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }

        var _showAndHideInternet = function(id){
            if(id == $("input[name='group_id_access_internet']").val() && ($(".group_access_internet").is(":visible"))){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_access_internet']").val(id);
                _bodyShow = "internet";
                _bodyShowID = id;
                //show the initial data
                _setInternetStatus(id);
                $(".group_detail").hide();
                $(".group_access_internet").show();
                _showGroupNameTitle(id);
            }
        }

        var _showAndHideUrl = function(id){
            if(id == $("input[name='group_id_url']").val() && ($(".group_url").is(":visible"))){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_url']").val(id);
                _bodyShow = "url";
                _bodyShowID = id;
                //show the initial data
                _addUrlData(id);
                $(".group_detail").hide();
                $(".group_url").show();
                _showGroupNameTitle(id);
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }

        var _showAndHideScd = function(id){
            if(id == $("input[name='group_id_scd']").val()
                && ($(".group_scd").is(":visible"))
                && (0 == $("input[name='isbed']").val())){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_scd']").val(id);
                $("input[name='isbed']").val(0);
                _bodyShow = "shd";
                _bodyShowID = id;
                //show the initial data
                _addScdData(id,false);
                $(".bed_title").hide();
                $(".scd_title").show();
                $(".group_detail").hide();
                $(".group_scd").show();
                _showGroupNameTitle(id);
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }

        var _showAndHideBed = function(id){
            if(id == $("input[name='group_id_scd']").val()
                && ($(".group_scd").is(":visible"))
                && (1 == $("input[name='isbed']").val())){
                $(".group_detail").hide();
                _clearStorage();
            }else{
                $("input[name='group_id_scd']").val(id);
                $("input[name='isbed']").val(1);
                _bodyShow = "bed";
                _bodyShowID = id;
                //show the initial data
                _addScdData(id,true);
                $(".scd_title").hide();
                $(".bed_title").show();
                $(".group_detail").hide();
                $(".group_scd").show();
                _showGroupNameTitle(id);
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }

        var _loadGroupList = function(){
            if(_pcVersion.Mode == "NEW_ONLY"){
                $('#back_button').hide();
            }
            var groupList = $("#group_list");
            $.map(_parentalCtrlGroupList, function (group, i){
                var bedNum = 0;
                $.map(group.Schedule, function (shd, i){
                    if(shd.IsBedtime){
                        bedNum ++;
                    }
                });
                var shdNum = group.ScheduleTimeNumberOfEntries - bedNum;
                var accessInternet = group.AccessInternet ? $("#enable").text() : $("#disable").text();
                groupList.append(
                $("<tr></tr>")
                .append($("<td><a class='group_name_tb' href='#' id='"+ 'group_name_tb_id_' + group._oid +"' >"+"</a></td>"))
                .append($("<td><a class='group_device_tb' href='#' id='"+ 'group_device_tb_id_' + group._oid +"' >" + group.Device.length + "</a></td>"))
                .append($("<td><a class='group_internet_tb' href='#' id='"+ 'group_internet_tb_id_' + group._oid +"' >" + accessInternet + "</a></td>"))
                .append($("<td><a class='group_url_tb' href='#' id='"+ 'group_url_tb_id_' + group._oid +"' >" + group.UrlFilter[0].UrlAddress.length + "</a></td>"))
                .append($("<td><a class='group_shd_tb' href='#' id='"+ 'group_shd_tb_id_' + group._oid +"' >" + shdNum + "</a></td>"))
                .append($("<td><a class='group_bed_tb' href='#' id='"+ 'group_bed_tb_id_' + group._oid +"' >" + bedNum + "</a></td>"))
                .append($("<td>" + group.UrlFilter[0].BlockedUrlNumber + "</td>"))
                .append(group.HomeGroup
                    ? $("<td><del>"+ $("#delete_button").text() +"</del></td>")
                    : $("<td><a class='group_delete' id='del_group_"+group._oid+"' href='?act=del_group_N&oid="+group._oid+"'></a></td>"))
                );
                $("a[id='group_name_tb_id_" + group._oid + "']").text(group.Name);
                _addDeleteButton("del_group_"+group._oid);
            })
            groupList.find(".group_delete").click(function() {
                /*var oid = $(this).attr("id").replace("del_group_","");
                var index = _getGroupIndexByOid(oid);
                if(typeof(index) == "undefined"){
                    return false;
                }
                console.log("gropup = ",_parentalCtrlGroupList[index]);
                if(_parentalCtrlGroupList[index].HomeGroup){
                    alert($("#home_delete").text());
                    return false;
                }*/
                _clearStorage();
                _showSpecifiedArea();
            });
            groupList.find(".group_name_tb").click(function() {
                var oid = $(this).attr("id").replace("group_name_tb_id_","");
                _clearInputArea();
                _showAndHideGroupName(oid);
            });
            groupList.find(".group_device_tb").click(function() {
                var oid = $(this).attr("id").replace("group_device_tb_id_","");
                _clearInputArea();
                _showAndHideDevices(oid);
            });
            groupList.find(".group_internet_tb").click(function() {
                var oid = $(this).attr("id").replace("group_internet_tb_id_","");
                _clearInputArea();
                _showAndHideInternet(oid);
            });
            groupList.find(".group_url_tb").click(function() {
                var oid = $(this).attr("id").replace("group_url_tb_id_","");
                _clearInputArea();
                _showAndHideUrl(oid);
            });
            groupList.find(".group_shd_tb").click(function() {
                var oid = $(this).attr("id").replace("group_shd_tb_id_","");
                _clearInputArea();
                _showAndHideScd(oid);
            });
            groupList.find(".group_bed_tb").click(function() {
                var oid = $(this).attr("id").replace("group_bed_tb_id_","");
                _clearInputArea();
                _showAndHideBed(oid);
            });
        };

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
                _loadWindow();
                _loadGroupList();
                _loadSubMenu();
                _bindListener();
                $(document).ready(function () {
                    _bodyRefresh();
                });
            }
        }.constructor();
    };
});