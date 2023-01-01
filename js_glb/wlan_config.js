function get_24ghz_channel_list(wl_mode, bandwidth, channels) {
		
	var channelsArr = channels.split(";");
	
	var channelElements;
	
	if (bandwidth == "0") {
		channelElements = channelsArr[0].split(",");
		
	} else {
		if(channelsArr[1] === undefined)
		{
			channelElements = [];
		}
		else
		{
			channelElements = channelsArr[1].split(",");
		}		
	}
	return decide_channelvalue(wl_mode, channelElements);
}

function decide_channelvalue(wl_mode, channelElements) {
	var channellist = new Array();	
	channellist.push("Auto");
	
	for (var i in channelElements) {
		if (channelElements[i] != "14"){
			channellist.push(channelElements[i]);
		} else if(wl_mode == "b") {
			channellist.push(channelElements[i]);
		}
	}
	
	return channellist;
}

function getPinInputValue(wps_mode, pin_input) {
        if (wps_mode == "ap_pin") {
                if (/^[0-9]{8}$/.test(pin_input)) {
                        return pin_input;
                }
        } 
        else {
                if (/^[0-9]{8}$/.test(pin_input) 
					|| /^(\d){4}[- ](\d){4}$/.test(pin_input)
					|| /^[0-9]{4}$/.test(pin_input) ) {
                        return pin_input.replace(/[^0-9]+/g, '');
                }
        }

        return "0";
}

function isStaPinValueValid(PIN) {
		if ( PIN <= 9999) {
			return true;
		}
		else {
			var accum = 0;
			accum += parseInt(3 * parseInt(parseInt(PIN / 10000000) % 10));
			accum += parseInt(1 * parseInt(parseInt(PIN / 1000000) % 10));
			accum += parseInt(3 * parseInt(parseInt(PIN / 100000) % 10));
			accum += parseInt(1 * parseInt(parseInt(PIN / 10000) % 10));
			accum += parseInt(3 * parseInt(parseInt(PIN / 1000) % 10));
			accum += parseInt(1 * parseInt(parseInt(PIN / 100) % 10));
			accum += parseInt(3 * parseInt(parseInt(PIN / 10) % 10));
			accum += parseInt(1 * parseInt(parseInt(PIN / 1) % 10));

			return (0 == parseInt(accum % 10));
		}
        
}

function ifAddtoWanConnectionNameList(wan_connection_name)
{
    if (wan_connection_name.search("VOIP") !=-1 && wan_connection_name.search("TR069") ==-1 && wan_connection_name.search("INTERNET") ==-1 && wan_connection_name.search("OTHER") ==-1) //ONLY VOIP
    {
	return false;
    }
    else if (wan_connection_name.search("VOIP") ==-1 && wan_connection_name.search("TR069") ==-1 && wan_connection_name.search("INTERNET") ==-1 && wan_connection_name.search("OTHER") !=-1) //only OTHER
    {
	return false;
    }
    else if (wan_connection_name.search("VOIP") !=-1 && wan_connection_name.search("TR069") ==-1 && wan_connection_name.search("INTERNET") ==-1 && wan_connection_name.search("OTHER") !=-1) // only VOIP && OTHER
    {
	return false;
    }
	return true;
}
function hideWLAN(policyGREClass)
{
    var arrayLAN = (policyGREClass.stringCWLAN).split(',');
    for(var i = 0;i < arrayLAN.length;i++)
    {
        for(var k = 1;k <= 8;k++)
        {
            if(arrayLAN[i] == k)
            {
                $('#wl_id option[value='+k+']').remove();
                break;
            }
        }
    }
}
function setDomainDefault()
{
    $('#dnName').val('dfault');
    $('#wanList').val('-2');
    $('#nofIP').val('24');
    var pos = -1;
    mask_lan(domain_group,pos);
    handleBridgedEthPorts(checkEthPorts);
}
function isDomainGroupShow()
{
    if($("input[name='dnEnable']").prop('checked'))
    {
	$("#dnGroup").show();
	var stringSSID = $('#wl_id').find(":selected").text();
	var pos = getPosofSSID(domain_group,stringSSID);
        if (pos == -1)
        {
	    setDomainDefault();
        }
    }
    else
    {
	$("#dnGroup").hide();
    }
}
function isNewEntryShow()
{
    if($("input[name='newdncontrol']").prop('checked'))
    {
	$(".newdnEntry").show();
	setDomainDefault();
	$("#dnName").prop("disabled",true);
    }
    else
    {
 	$("#dnName").prop("disabled",false);
	setDomainDefault();
	$("#newDomain").val('');
	$(".newdnEntry").hide();
    }
}
function option_html(connect_type,_oid,dev_id,wan_id,Wan_Conn_name)
{
   	$('<option>').val(connect_type+","+ wan_id + "," + dev_id +","+ _oid).text(Wan_Conn_name).appendTo('#wanList');
}
function option_domain_html(domain_name)
{
    var doptions = "";
    doptions += '<option id="' + domain_name + '" value="' + domain_name + '">' + domain_name + '</option>';
    $('#dnName').append(doptions);
}
function createWANList(wan_onload)
{
    $("select[name='wanList']"),$.map(wan_onload,function(conn,idx)
    {
	with(conn)
        {
            if(ipConns.length)
            {
		if((ipConns[0].X_CT_COM_IPMode == 2) || (ipConns[0].X_CT_COM_IPMode == 3)) return;
            	return $.map(ipConns, function(ip_conn, i)
                {
                    return option_html("ip",ip_conn._oid,ip_conn.dev_id,ip_conn.wan_id,ip_conn.Name);
                });
            }
            else if(pppConns.length)
            {
            	if(pppConns[0].ConnectionType == "PPPoE_Bridged") return;
		if((pppConns[0].X_CT_COM_IPMode == 2) || (pppConns[0].X_CT_COM_IPMode == 3)) return;
                return $.map(pppConns,function(ppp_conn,i)
                {
                    return option_html("ppp",ppp_conn._oid,ppp_conn.dev_id,ppp_conn.wan_id,ppp_conn.Name);
                });
            }
        }
    });
}
function createDomainList(domain_group)
{
    $("select[name='dnName']"),$.map(domain_group,function(domain,idx)
    {
    	with(domain)
	{
	    if(domain.dhcpaccess.DomainName)
	    {
	  	return option_domain_html(domain.dhcpaccess.DomainName);
	    }
	}
    });
}
function createLANPorts(noofports)
{
    var i = 0;
    for (i = 1; i <= 5; i++)
    {
    	var LANcheckBox = $('<label class="form-check-inline"><input type="checkbox" id="LAN' + i + '" name="LAN' + i + '" value="' + i + '"  class="form-check-input"><span id ="clan'+ i + '">LAN' + i + '</span></label>');
        LANcheckBox.appendTo('#LANcheckBoxs');
    }
    for(i = noofports+1;i <= 5;i++)
    {
	hideBridgedEthPorts(i);
    }
}
function hideBridgedEthPorts(count)
{
    var tagLan = "#LAN" + count;
    var tagSpan = "#clan" + count;
    $(tagLan).hide();
    $(tagSpan).hide();
}
function uncheckLANports()
{
    var noofports = countLanPorts.LANEthernetInterfaceNumberOfEntries;
    var i;
    for(i = 1;i <= noofports;i++)
    {
	var tempLan = "#LAN" + i;
	$(tempLan).prop("checked",false);
    }
}
function handleBridgedEthPorts(checkEthPorts)
{
    uncheckLANports();
    for (var i = 0; i < checkEthPorts.ethPort.length; i++)
    {
	if (checkEthPorts.ethPort[i].lan == 0)
	{
  	    hideBridgedEthPorts(i+1);
	}
    }
}
function setDefault()
{
    $("#dnEnable").prop("disabled",false);
    $("#dnEnable").prop("checked",false);
    $("#dnGroup").hide();
    $('#dnName').val('dfault');
    $('#wanList').val('-2');
    $('#nofIP').val('24');
    handleBridgedEthPorts(checkEthPorts);
}
function getPosofDomain(domain_group,searchstr)
{
    var count;
    for (count = 0; count < domain_group.length; count++)
    {
	if(domain_group[count].dhcpaccess.DomainName === searchstr)
	{
	    break;
	}
    }
    return count;
}
function onchangeDomain()
{
    $('#wanList').val('-2');
    $('#nofIP').val('24');
    handleBridgedEthPorts(checkEthPorts);
    var selectedDomain = $('#dnName').val();
    if(selectedDomain !== "dfault")
    {
    	var pos = getPosofDomain(domain_group,selectedDomain);
        $('#dnEnable').prop('checked', true);
        $("#dnGroup").show();
        get_domain_access_value(domain_group[pos]);
	enableLAN();
        mask_lan(domain_group,pos);
        get_lan_access_value(domain_group[pos]);
        if(domain_group[pos].ipConns)
        {
            if (domain_group[pos].ipConns.length != 0)
            {
                get_wan_access_value('ip',domain_group[pos].ipConns[0]._oid,domain_group[pos].ipConns[0].dev_id,domain_group[pos].ipConns[0].wan_id,domain_group[pos].ipConns[0].Name);
            }
        }
        if(domain_group[pos].pppConns)
        {
            if (domain_group[pos].pppConns.length != 0)
            {
                get_wan_access_value('ppp',domain_group[pos].pppConns[0]._oid,domain_group[pos].pppConns[0].dev_id,domain_group[pos].pppConns[0].wan_id,domain_group[pos].pppConns[0].Name);
            }
        }        
    }
    else
    {
    	$('#wanList').val('-2');
        $('#nofIP').val('24');
        var pos = -1;
        mask_lan(domain_group,pos);
    }
}
function enableLAN()
{
    var noofports = countLanPorts.LANEthernetInterfaceNumberOfEntries;
    var i;
    for(i = 1;i <= noofports;i++)
    {
        var tempLan = "#LAN" + i;
 	$(tempLan).prop('disabled', false);
    }
}
function disableLAN(lan)
{
    var noofports = countLanPorts.LANEthernetInterfaceNumberOfEntries;
    var i;
    for(i = 1;i <= noofports;i++)
    {
        var tempLan = "LAN" + i;
        if(lan == tempLan)
        {
            var tagLan = "#LAN" + i;
	    $(tagLan).prop('disabled', true);
            break;
        }
    }
}
function disableBridgedLAN(wanBridgedLans)
{
   var arrayLAN = (wanBridgedLans.stringLAN).split(',');
   for(var i = 0;i < arrayLAN.length;i++)
   {
       disableLAN(arrayLAN[i]);
   }
}
function disableGRELAN(GRE_LANS)
{
   var arrayLAN = (GRE_LANS.stringGLAN).split(',');
   for(var i = 0;i < arrayLAN.length;i++)
   {
       disableLAN(arrayLAN[i]);
   }
}
function disableVLAN(getVLANBinding)
{
   var arrayLAN = (getVLANBinding.stringLAN).split(',');
   for(var i = 0;i< arrayLAN.length;i++)
   {
       disableLAN(arrayLAN[i]);
   }
}
function disableBridgedSSID(wanBridgedLans)
{
    var arrayLAN = (wanBridgedLans.stringWLAN).split(',');
    var wifi_id = $('#wl_id').val();
    for(var i = 0;i < arrayLAN.length;i++)
    {
       if(arrayLAN[i] == wifi_id)
       {
           $("#dnEnable").prop("disabled",true);
           break;
       }
    }
}
function disableGRESSID(GRE_LANS)
{
    var arrayLAN = (GRE_LANS.stringGWLAN).split(',');
    var wifi_id = $('#wl_id').val();
    for(var i = 0;i < arrayLAN.length;i++)
    {
       if(arrayLAN[i] == wifi_id)
       {
           $("#dnEnable").prop("disabled",true);
           break;
       }
    }
}
function mask_lan(domain_group,pos)
{
    for(var count = 0;count < domain_group.length;count++)
    {
        if(domain_group.length != 0)
        {
            if(count != pos)
            {
                var source = domain_group[count].dhcpaccess.SourceInterface;
                source = source.toUpperCase();
                for(var i = 0;i < srcintJSON.srcjson.length; i++)
                {
                    var target = srcintJSON.srcjson[i].cgi;
                    if (source.indexOf(target) != -1)
                    {
                        disableLAN(srcintJSON.srcjson[i].web);
                    }
                }
            }
        }
    }
}

function checkLAN(lan)
{
    var noofports = countLanPorts.LANEthernetInterfaceNumberOfEntries;
    var i;
    for(i = 1;i <= noofports;i++)
    {
	var tempLan = "LAN" + i;
	if(lan == tempLan)
	{
	    var tagLan = "#LAN" + i;
	    $(tagLan).prop('checked', true);
	    break;
	}
    }
}
function get_lan_access_value(domainaccess)
{
    var source = domainaccess.dhcpaccess.SourceInterface.toUpperCase();
    for (var i = 0; i < srcintJSON.srcjson.length; i++)
    {
	var target = srcintJSON.srcjson[i].cgi;
	if (source.indexOf(target) != -1)
	{
	    checkLAN(srcintJSON.srcjson[i].web);
	}
    }
}
function get_domain_access_value(domainaccess)
{
    $("select[name='dnName']").val(domainaccess.dhcpaccess.DomainName);
    $("select[name='nofIP']").val(domainaccess.dhcpaccess.X_ALU_COM_NumberOfIPRequested);
}
function get_wan_access_value(connect_type, _oid, dev_id, wan_id, connName)
{
    if(connName)
    {
    	$("select[name='wanList']").val(connect_type+","+ wan_id + "," + dev_id +","+ _oid);
    }
}
function getPosofSSID(domain_group,searchstr)
{
    var count;
    var flag = 0;
    for (var i = 0; i < srcintJSON.srcjson.length; i++)
    {
	var target = searchstr.toUpperCase();
	if (target == srcintJSON.srcjson[i].web)
	{
	    searchstr = srcintJSON.srcjson[i].cgi;
	    flag = 1;
	    break;
	}
    }
    if(flag != 0)
    {
	var i = 0;
	for (count = 0; count < domain_group.length; count++)
	{
	    if (domain_group.length != 0)
	    {
		var srcIntf = (domain_group[count].dhcpaccess.SourceInterface).split(',');
		for(i = 0;i < srcIntf.length;i++)
		{
		    srcIntf[i] = srcIntf[i].trim();
		    srcIntf[i] = srcIntf[i].toUpperCase();
		}
		if(srcIntf)
		{
		    if($.inArray(searchstr, srcIntf) > -1)
		    {
			break;
		    }
		}
	    }
	}
    }
    else
    {
	return -1;
    }
    if(count == domain_group.length)
    {
	return -1;
    }
    return count;
}
function handleDomainGroup()
{
    if (domain_group.length != 0)
    {
	var stringSSID = $('#wl_id').find(":selected").text();
        var pos = getPosofSSID(domain_group,stringSSID);
        if (pos != -1)
        {
            if(domain_group[pos].dhcpaccess.Enable){
                $('#dnEnable').prop('checked', true);
            }
            $("#dnGroup").show();
            get_domain_access_value(domain_group[pos]);
	    enableLAN();
            mask_lan(domain_group,pos);
            get_lan_access_value(domain_group[pos]);
            if(domain_group[pos].ipConns)
            {
            	if (domain_group[pos].ipConns.length != 0) //load wan_access data related to 1st available wan_connection_name
                {
                    get_wan_access_value('ip',domain_group[pos].ipConns[0]._oid,domain_group[pos].ipConns[0].dev_id,domain_group[pos].ipConns[0].wan_id,domain_group[pos].ipConns[0].Name);
                }
            }
            if(domain_group[pos].pppConns)
            {
                if (domain_group[pos].pppConns.length != 0)
                {
                    get_wan_access_value('ppp',domain_group[pos].pppConns[0]._oid,domain_group[pos].pppConns[0].dev_id,domain_group[pos].pppConns[0].wan_id,domain_group[pos].pppConns[0].Name);
                }
            }
        }
    }
}
function init_domain_group_value(domain_group,noofports)
{
    createWANList(wan_onload);
    createDomainList(domain_group); 
    createLANPorts(noofports);
}
function hasSameSsidName()
{
    var edited_wlname = $("input[name='wl_ssid']").val();
    if(edited_wlname !== wl_name) {
        var ssidNameArr = wlan_name.ssid_name ? (wlan_name.ssid_name).split(',') : [];
        var arrayLAN = wanBridgedLans.stringWLAN ? (wanBridgedLans.stringWLAN).split(',') : [];
        var isBridgedSsid = 0;
        const ssidBridged = [];
        const ssidRouted = [];
        if (arrayLAN.length > 0) {
            for (var i = 1;i <= 8;i++) {
               arrayLAN.indexOf(i.toString()) > -1 ? ssidBridged.push(ssidNameArr[i-1]) : ssidRouted.push(ssidNameArr[i-1]);
            }
            isBridgedSsid = arrayLAN.indexOf($("select[name='wl_id']").val());
            if (isBridgedSsid!=-1) {
               if (ssidRouted.indexOf($.trim($("input[name='wl_ssid']").val())) > -1) {
                    return true;
                }
            }
            else {
                if (ssidBridged.indexOf($.trim($("input[name='wl_ssid']").val())) > -1) {
                    return true;
                }
            }
        }
    }
    return false;
}

