define([], function () {

    return function (wlan_config_2_4) {
        var _self;
        var _wlan_config = wlan_config_2_4;

        var _isAllPreSharedKeyChanged = function(){
            var i = 1;
            $.each(wlan_config_2_4, function (key, value) {
                if (value.SSID) {
                    if(value.psks[1].PreSharedKey === value.psks[1].DefaultPreSharedKey){
                        i = 0;
                    }
                }
            });
            return (i === 1)?true:false;
        };
        var _loadWirelessFieldset = function(){
            if(_isAllPreSharedKeyChanged() === true){
                $("form[name='set24']").hide();
                sessionStorage.setItem("wireless_pwd_changed", "ok");
            }
        }
        var _getWlanPwd = function (id) {

            if (_wlan_config[id].psks) {
                return wlan_config_2_4[id].psks[1].PreSharedKey;
            } else if (wlan_config_2_4[id].wepKeys) {
                return wlan_config_2_4[id].wepKeys[1];
            } else {
                return NULL;
            }

        };

        var _getEncryptionMode = function (id) {
            if (_wlan_config[id].psks) {
                return "WPA";
            } else if (wlan_config_2_4[id].wepKeys) {
                return "WEP";
            } else {
                return "NULL";
            }
        };
 
        var _loadData24 = function (wlan_config_2_4) {
            var optionstring = "";
            $.each(wlan_config_2_4, function (key, value) {
                if (value.SSID) {
                    if(value.psks[1].PreSharedKey == value.psks[1].DefaultPreSharedKey){
                        optionstring += "<option value=\"" + key + "\" >" + value.SSID + "</option>";
                    }
                }
            });
            $("#wl_id").html(optionstring);
        };
        var _ssid_change = function (wlan_config_2_4) {
            var id = 0
            $("select[name='wl_id']").on("change", function () {
                id = $(this).children('option:selected').val();
                //console.log(id);
                var pwd = _getWlanPwd(id);
                $("#cu_2g_pwd").val(pwd);
            });

        };

        var _show_modial_alert = function () {
            $('#myModal').modal({
                keyboard: false,
                show: true,
                backdrop: "static"
            });

        };

        var _getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        };
        var _redirect = function (address) {
            if (address) {
                window.location.replace("http://" + address);
            } else {
                window.location.replace("about:blank");
            }
        }

        var _redirectToInternet = function () {
            $('#disable_portal_change_password').on("click", function () {
                $.post(location.pathname + "?disablePortalChangePassword")
                        .done(function (ret) {
                            _redirect(_getUrlParam('addr'));
                        })
                        .fail(function () {
                            alert("error");
                        })
                        .always(function () {
                            // alert("finished");
                        });
            });

        };

        var _setRemindDisable = function () {
            $('.disable_remind_temporary').on("click", function () {
                $.post(location.pathname + "?disableRemindTemporary")
                        .done(function (ret) {
                           _redirect(_getUrlParam('addr'));
                        })
                        .fail(function () {
                            console.log("error");
                        })
                        .always(function () {
                            // alert("finished");
                        });
            });
        };
        var _getWlan = function(){
            $.post(location.pathname + "?getWlanConfig")
                        .done(function (ret) {
                           var obj =JSON.parse(ret);
                            _self.load(obj);
                        })
                        .fail(function () {
                            alert("error");
                        })
                        .always(function () {
                            // alert("finished");
                        });
        };

        return{
            constructor: function (wlan_config_2_4) {
                _self = this;
                _self.init();
                _self.load(wlan_config_2_4);
                _ssid_change(wlan_config_2_4);
                return this;
            },

            init: function () {
                //_show_modial_alert();
                _redirectToInternet();
                _setRemindDisable();
            },
            load: function (wlan_config_2_4) {
                _loadWirelessFieldset();
                _loadData24(wlan_config_2_4);
            },
            getWlan:function(){
                _getWlan();
            }
        }.constructor(wlan_config_2_4);
    };
});