(function ($) {
    function CheckExpire()
    {
        $.ajax({
            type: 'POST',
            url: '/check_expire.cgi',
            data: '',
            dataType: "json"
        }).done(function (exp) {
            if (exp.expired != "no")
            {
                window.location.reload();
            }
        })
    }

    function InitEasySetup()
    {
        var t = $.post("../easy_setup.cgi?getValue", function (a) {
            d = $.parseJSON(a);
            for (i = 1; i < d.lan_num + 1; i++)
            {
                $("#port_staus").append('<div class="col-xs-3" id="LAN' + i + '"><div><p class="text-center">' + "LAN" + i + '</p></div><div class="list-horizontal-item"><img src="img_glb/lan.png" alt="client"></div></div>');
            }
            $.each(d, function (index, value) {
                switch (index) {
                case "internet_pppoe":
                    $("#internet_username").val(value[0].name);
                    $("#internet_password").val(value[0].password);
                    $('#internet-submit').prop('disabled', false);
                break;
                case "voip_pppoe":
                    $("#voip_username").val(value[0].name);
                    $("#voip_password").val(value[0].password);
                    $('#voip-submit').prop('disabled', false);
                break;
                case"wifi":
                    $.each(value, function (i, v) {
                        if (1==v.wifi_display){
                            // When get the first wifi_display as 1, means "#wifi_ssid_select" shows the related SSID which index is i.
                            $("#wifi_encryptionmode").prop("disabled", false);
                            InitWifiValue(i, value);
                            return false;
                        }
                        else
                        {
                            $("#wifi_encryptionmode").val("");
                            $("#wifi_encryptionmode").prop("disabled", true);

                        }
                    });
                    break;
                    case"admin":
                        $("#admin_password").val(value[0].password);
                    break;
                    case"dhcp":
                        (value[0].DHCPServerEnable == "1") ? $("#dhcp-checkbox").prop("checked", true) : $("#dhcp-checkbox").prop("checked", false);
                    break;
                    case "dns":
                        if(value[0].dns1=="0.0.0.0"|| value[0].dns1==null )
                        {
                            $("#dns1").val('');
                        }
                        else
                        {
                            $("#dns1").val(value[0].dns1);
                        }

                        if(value[1].dns2=="0.0.0.0"|| value[1].dns2==null )
                        {
                            $("#dns2").val('');
                        }
                        else
                        {
                            $("#dns2").val(value[1].dns2);
                        }

                        if(value[2].dns3=="0.0.0.0"|| value[2].dns3==null )
                        {
                            $("#dns3").val('');
                        }
                        else
                        {
                            $("#dns3").val(value[2].dns3);
                        }
                    break;
                    case "lan":
                        console.log(value);
                        $.each(value, function (i, v) {
                            $("#" + i).find('img').after('<div><p class="text-center">' + v.HostName + '</p></div>');
                            $("#" + i).find('img').addClass("button button-glow button-box button-action button-jumbo");
                            $(".lan-table").find('tbody').append('<tr><td>' + i + '</td><td>' + v.Service + '</td><td>' + v.vlanid + '</td><td>' + v.HostName + '</td></tr>');
                        })
                    break;
                }
            });
        });
        return t;
    }

    var d = "";
    $(document).ready(function () {
        setInterval(CheckExpire, 10000);

        InitEasySetup();
        $('input[type="checkbox"]').on('change', function (e) {
            $('#myModal2').modal();
        });
		
        var activePassword = (function () {
            return{
                replace: function ($this, id, name, bind) {
                    $this.html('<input class="form-control" id=' + id + '  name=' + name + ' type="password" /><span class="glyphicon icon-eye ' + bind + '"></span>');
                },
                showEye: function (bind) {
                    $(bind).show();
                },
                hideEye: function (bind) {
                    $(bind).hide();
                }
            };
        }());



        $("#pwd-internet").dblclick(function () {
            activePassword.replace($(this), "internet_password", "internet_password", "glyphicon-eye-open1");
        });

        $("#pwd-internet").delegate('input', 'keyup', function () {
            if ($(this).val()) {
                activePassword.showEye(".glyphicon-eye-open1");
            } else {
                activePassword.hideEye(".glyphicon-eye-open1");
            }
        });
        $("#pwd-internet").delegate('span', 'mousedown', function () {
            $("#internet_password").attr('type', 'text');
        }).mouseup(function () {
            $("#internet_password").attr('type', 'password');
        }).mouseout(function () {
            $("#internet_password").attr('type', 'password');
        });


        $("#pwd-voip").dblclick(function () {
            activePassword.replace($(this), "voip_password", "voip_password", "glyphicon-eye-open2");
            //$(this).html('<input class="form-control" id="internet_password"  name="internet_password" type="password" /><span class="glyphicon glyphicon-eye-open glyphicon-eye-open1"></span>');
        });


        $("#pwd-voip").delegate('input', 'keyup', function () {
            if ($(this).val()) {
                $(".glyphicon-eye-open2").show();
            } else {
                $(".glyphicon-eye-open2").hide();
            }
        });
        $("#pwd-voip").delegate('span', 'mousedown', function () {
            $("#voip_password").attr('type', 'text');
        }).mouseup(function () {
            $("#voip_password").attr('type', 'password');
        }).mouseout(function () {
            $("#voip_password").attr('type', 'password');
        });
        $("#div-wifi-pwd").delegate('input', 'keyup focus', function () {
            if ($(this).val()) {
                $(".glyphicon-eye-open3").show();
            } else {
                $(".glyphicon-eye-open3").hide();
            }
            if($(":input[name='csswd']").val()!="1"){
                $(":input[name='wpaKey']").val($(":input[name='csswd']").val());			
                $("#wpaKey").attr('type', 'password');
                $(":input[name='csswd']").val("1");	
            }
        });
        $("#div-wifi-pwd").delegate('span', 'mousedown', function () {
            $("#wpaKey").attr('type', 'text');
        }).mouseup(function () {
            $("#wpaKey").attr('type', 'password');
        }).mouseout(function () {
            $("#wpaKey").attr('type', 'password');
        });

    });
	
	function ValidIpStr(ipStr)
	{
		tstr=ipStr.trim()
		if(tstr=="")return false;
		if(!(/^(\d{1,3}\.){3}\d{1,3}$/.test(tstr)))return false;

        nos = tstr.split(".");
        for (var i in nos) {
            if (nos[i] < 0 || nos[i] > 255) {
				return false;
			}
		}
		return true;
	}

    var showMsg = function (type, msg) {
        var $msg = $('#msg');
        var top = $(document).scrollTop() + $(window).height() / 2;
        if ($msg.length === 0) {
            $msg = $('<span id="msg" style="font-weight:bold;position:absolute;top:' + top + 'px;left: 50%;z-index:9999"></span>');
            $('body').append($msg);
        }
        //console.log($msg);
        $msg.stop(true).attr('class', 'alert alert-' + type).text(msg).css('margin-left', -$msg.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
    };
    $("form.form-pppoe").submit(function () {
        $data = $('form.form-pppoe').serialize();
        console.log($data);
        $.post("../easy_setup.cgi?PPPoEconfig", $data).done(function (a) {
            console.log(a);
            if (a === "success") {
                showMsg("success", "change internet ok");
            } else {
                showMsg("success", "change internet nok");
            }
        });
        return false;
    });
    $("form.form-voip").submit(function () {
        $data = $('form.form-voip').serialize();
        //alert($data);
        $.post("../easy_setup.cgi?VOIPconfig", $data).done(function (a) {
            if (a === "success") {
                showMsg("success", "change Voip ok");
            } else {
                showMsg("success", "change Voip nok");
            }
        });
        return false;
    });

    $("form.form-dns").submit(function () {
         var dns1 =$("input[name='dns1']").val();
	 var dns2 =$("input[name='dns2']").val();
         var dns3 =$("input[name='dns3']").val();

         if($.trim(dns1)){
	      if(!ValidIpStr(dns1)){
	           alert("Please input valid dns1");
                   return false;
              }
         }
         if($.trim(dns2)){
              if(!ValidIpStr(dns2)){
                   alert("Please input valid dns2");
                   return false;
              }
         }
         if($.trim(dns3)){
              if(!ValidIpStr(dns3)){
                   alert("Please input valid dns3");
                   return false;
              }
        }
        $("#dnsModal").modal();
        return false;
    });

    $(".rebootValideDNS").click(function () {
        $data = $('form.form-dns').serialize();
        $.post("../easy_setup.cgi?configDNS", $data, function (a) {
            if (a === "success") {
                $.post("../easy_setup.cgi?reboot", "valide=1", function (a) {
                    if (a === "success") {
                        showMsg("success", "reboot ok!");
                        window.location.replace("/login.cgi?out");
                    } else {
                        showMsg("success", "reboot Nok!");
                    }
                });
            }
        });
    });

    $("form.form-wifi").submit(function () {
        /*var psk = $("#wpaKey").val();
        if (psk.length < 8) {
            alert("WPA preshared key must be 8-64 length");
            return false;
        }
        var is_equal = (function () {
            var success = false;
            var ssid_name = $("#wifi_ssid").val();
            $.each(d.wifi, function (index, value) {
                if(index!=($("#wifi_ssid_select").val()-1))
                {
                    if (value.wifi_ssid === ssid_name) {
                        success = true;
                        return false;
                    }
                }
            });
            return success;
        }());
        if (is_equal === true) {
            alert("The SSID name has existed!");
            return false;
        }*/

	 //disable the Button "OK" when save the wifi data
        var p=$("input[name='wpaKey']").val()+"";
        $(":input[name='wpaKey']").prop('type','password');
        if(p=="**********")
        {
            $(":input[name='wpaKey']").val($(":input[name='csswd']").val());
        }	
	 $("#wifi-submit").prop("disabled", true);

        $data = $('form.form-wifi').serialize();
        $.post("../easy_setup.cgi?wifiConfig", $data, function (a) {
            if (a === "success") {
	        //refresh the easy_setup.html data after setting params.
                RefreshWifiData($("#wifi_ssid_select").val()-1);
                showMsg("success", "change ok!");
            }

	     //enable the Button "OK" after recieving the post_request.
	     $("#wifi-submit").prop("disabled", false);
        });

        return false;
    });

    $(".rebootValide").click(function () {
        $.post("../easy_setup.cgi?reboot", "valide=1", function (a) {
            if (a === "success") {
                showMsg("success", "reboot ok!");
                $(".ModalReboot").modal("hide");
                window.location.replace("/login.cgi?out");
            } else {
                showMsg("success", "reboot Nok!");
            }
        });
    });

    var validation = (function () {
        return {
            isEqual: function (val1, val2) {
                return val1 === val2;
            }
        };
    }());

    function sequentialTest(str, num)
    {
        if (num < 2)
            return true;

        for(var i = 0;  i < str.length; i++)
        {
            var current = str.charCodeAt(i);
            var m = 0;
            for(var j = i + 1; j < str.length; j++)
            {
                var next = str.charCodeAt(j);
                if (next == current + 1)
                {
                    current = next;
                    m++;
                    if (m >= num - 1)
                    {
                        return false;
                    }
                }
                else
                {
                    break;
                }
            }
        }

        return true;
    }
	
    function ValidPwd(str)
    {
        var result = !/[^\x20-\x7e]/g.test(str);//check the word that we can input from the computer keyboard ALU02110797

        if (!result)
        {
            alert("Please input valid characters.");
            return false;
        }

        var result = /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#%^&+=\\-_./,:])[0-9a-zA-Z!@#%^&+=\\-_./,:]{9,}$/g.test(str);
        if(!result)
        {
            alert("Strong password must be more than 8 characters, using combination of uppercase and lowercase and number and special characters");
            return false;
        }
        result = !/[$\\]/g.test(str)
        if(!result)
        {
            alert("Strong password must be more than 8 characters, using combination of uppercase and lowercase and number and special characters");
            return false;
        }

        result = !/(.)\1{3,}/g.test(str);
        if(!result)
        {
            alert("Password should not include more than 3 repeated characters");
            return false;
        }

        result = sequentialTest(str, 4);
        if(!result)
        {
            alert("Password should not include more than 3 sequential characters");
            return false;
        }

        return true;
    }

    function InitWifiEncryptionMode()
    {
        if ($("#wifi_encryptionmode").val() == "Private")
        {
            $("#wpa_settings").show();
            $("#wpaKey_setting").show();
            $('#wpaKey').attr('required','true');
            $("#ok_wifi").show();

            //when #wpaKey_setting is shown, init the Wifi WPA mode
            InitWifiWPAMode();
        }
        else if ($("#wifi_encryptionmode").val() == "Enterprise")
        {
            $("#wpa_settings").hide();
            $("#wpaKey_setting").hide();
            $('#wpaKey').removeAttr('required');
            $("#ok_wifi").hide();
        }
        else
        {
            $("#wpa_settings").hide();
            $("#wpaKey_setting").hide();
            $('#wpaKey').removeAttr('required');
            $("#ok_wifi").show();
        }
    }

    function InitWifiWPAMode()
    {
        if ($("#wifi_wpaver").val() == "11i")
        {
            $("#wifi_aes_mode").show();
            $("#wifi_tkip_aes_mode").hide();
            $("#wifi_wpaenc").val("AESEncryption");
        }
        else if ($("#wifi_wpaver").val() == "WPAand11i")
        {
            $("#wifi_aes_mode").hide();
            $("#wifi_tkip_aes_mode").show();
            $("#wifi_wpaenc").val("TKIPandAESEncryption");
        }
    }

    function InitWifiValue(ssid_show_index, wifi_obj_value)
    {
        $.each(wifi_obj_value, function (ssid_index, ssid_value) {
            if (1 == ssid_value.wifi_display){
                $("#wifi_ssid_select").append('<option value=' + (ssid_index + 1) + '>SSID' + (ssid_index + 1) + '</option>');
            }
        });

        $.each(wifi_obj_value, function (ssid_index, ssid_value) {
            if (1 == ssid_value.wifi_display)
            {
                if (ssid_show_index == ssid_index)//load the current SSID's info
                {
                    $("#wifi_ssid_select").val(ssid_index+1);
                    $("#wifi_ssid").val(wifi_obj_value[ssid_index].wifi_ssid);
                    $("#wpaKey").val("**********");
                    $("input[name='csswd']").val(crypto_page.aes_decrypt(session_id, wifi_obj_value[ssid_index].PreSharedKey));
                    //if wifi_encryption_settings is hidden, means not for VIET
                    if (!($("#wifi_encryption_settings").is(":hidden")))
                    {
                        (wifi_obj_value[ssid_index].wifi_encryptionmode == "EAPAuthentication") ? $("#wifi_encryptionmode").val("Enterprise") : (wifi_obj_value[ssid_index].wifi_wpaver == "None" ? $("#wifi_encryptionmode").val("None") : $("#wifi_encryptionmode").val("Private"));
                        $("#wifi_wpaver").val(wifi_obj_value[ssid_index].wifi_wpaver);
                        $("#wifi_wpaenc").val(wifi_obj_value[ssid_index].wifi_wpaenc);

                        InitWifiEncryptionMode();
                     }
                     return false;
                 }
             }
         });
         $("#wifi_ssid_select").unbind("change"); //unbind the function "change" of "#wifi_ssid_select"
         $("#wifi_ssid_select").change(function () {
             $("#wifi_ssid").val(wifi_obj_value[$(this).val() - 1].wifi_ssid);
             $("#wpaKey").val(wifi_obj_value[$(this).val() - 1].wpaKey);
             $("#wpaKey").val("**********");
             $("input[name='csswd']").val(wifi_obj_value[$(this).val() - 1].wpaKey);
             //if wifi_encryption_settings is hidden, means not for VIET
             if (!($("#wifi_encryption_settings").is(":hidden")))
             {
                 (wifi_obj_value[$(this).val() - 1].wifi_encryptionmode == "EAPAuthentication") ? $("#wifi_encryptionmode").val("Enterprise"): (wifi_obj_value[$(this).val() - 1].wifi_wpaver == "None" ? $("#wifi_encryptionmode").val("None") : $("#wifi_encryptionmode").val("Private"));

                 $("#wifi_wpaver").val(wifi_obj_value[$(this).val() - 1].wifi_wpaver);
                 $("#wifi_wpaenc").val(wifi_obj_value[$(this).val() - 1].wifi_wpaenc);

                 InitWifiEncryptionMode();
             }
         });

         //if wifi_encryption_settings is hidden, means not for VIET
         if (!($("#wifi_encryption_settings").is(":hidden")))
         {
             $("#wifi_encryptionmode").unbind("change"); //unbind the function "change" of "#wifi_encryptionmode"
             $("#wifi_encryptionmode").change(function() {
                 if ($("#wifi_encryptionmode").val() == "Private")
                 {
                     if (wifi_obj_value[$("#wifi_ssid_select").val() - 1].wifi_wpaver == "None")
                     {
                         $("#wifi_wpaver").val("11i");
                         $("#wifi_wpaenc").val("AESEncryption");

                     }
                 }
                 InitWifiEncryptionMode();
                 if ($("#wifi_encryptionmode").val() == "None")
                 {
                     alert("When the encryption mode is set to open, other people might be able to see info you send over this network.");
                 }

             });

             $("#wifi_wpaver").unbind("change"); //unbind the function "change" of "#wifi_wpaver"
             $("#wifi_wpaver").change(function() {
                 InitWifiWPAMode();
             });
         }
    }

    function RefreshWifiData(current_ssid)
    {
        //clean the "#wifi_ssid_select"
        $("#wifi_ssid_select").empty();

        var t = $.post("../easy_setup.cgi?getWifiValue", function (a) {
            easy_obj = $.parseJSON(a);
            $.each(easy_obj, function (index, value) {
                switch (index)
                {
                    case"wifi":
                    {
                        InitWifiValue(current_ssid, value);
                    }
                    break;
                    default:
                    break;
                }
            });
        });
        return t;
    }
    $("form.form-adminPasswd").valid_submit(function () {
        if (!validation.isEqual($('#admin_password').val(), $('#admin_re_entry').val())) {
            //alert("two input not the same");
            alert("New password is not same as re-enter password. Please confirm!");
            $("#collapseFive").find("div:first").next().addClass("has-error");
            $("#collapseFive").find("div:first").next().next().addClass("has-error");
            return false;
        }

        if (!ValidPwd($('#admin_password').val()))
        {
            return false;
        }

        $data = $('form.form-adminPasswd').serialize();
        $.ajax({
            type: 'POST',
            url: '../easy_setup.cgi?set',
            data: $data,
            dataType: "json"
        }).done(function (a) {
            if (a.ret != 0){
                if (a.ret == "success"){
                    showMsg("success", "Password changed OK!");
                }else if (a.ret == "same_to_ori_psd"){
                    showMsg("warning", "New password should not be same as old password!");
                }else{
                    showMsg("warning", "Original password error "+a.ret+" times"+", please input again!");
                    $("#collapseFive").find("div:first").addClass("has-error");
                }
            }else if(a.ret == 0)
            {
            	alert(a.msg);
                window.location.replace("/login.cgi?out");
             }
         })
        return false;
    });
	
    $("#Advance").click(function () {
		location.href = "index.cgi?Advance";
	});
})(this.jQuery);
