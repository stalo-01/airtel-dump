function update_node(obj,prefix)
{
    for(prop in obj){
        if($("#"+(prefix?prefix:"")+prop).length){
            $("#"+prop).html(obj[prop])
        }
    }
}
function html2Escape(sHtml) {

    return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});

}
String.prototype.trim=function()
{
    return this.replace(/(^\s*)|(\s*$)/g,"");
}
String.prototype.isdd=function()
{
    return this.match(/^\d+$/);
}

function ValidNumberInStr(text) {
    return text.match(/[0-9]/g)!=null;
}

function ValidUpperCaseInStr(text) {
    return text.match(/[A-Z]/g)!=null;
}

function ValidLowerCaseInStr(text) {
    return text.match(/[a-z]/g)!=null;
}

function ValidCheckForText(text, input, alertInfo) {
    if(alertInfo.numberError && (ValidNumberInStr(text)==false)) {
        alert(alertInfo.numberError);
        input.focus();
        return false;
    }

    if(alertInfo.upperCaseError && (ValidUpperCaseInStr(text)==false)) {
        alert(alertInfo.upperCaseError);
        input.focus();
        return false;
    }

    if(alertInfo.lowerCaseError && (ValidLowerCaseInStr(text)==false)) {
        alert(alertInfo.lowerCaseError);
        input.focus();
        return false;
    }
}


function ValidUrlStr(urlStr)
{
   tstr=urlStr.trim()
   if(/[#\\\'+\," ]/.test(tstr))
   {
      return false;
   }
   if(!(/[A-Za-z0-9]/.test(tstr)))
   {
      return false;
   }
   if(!(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i .test(tstr)))
   {
      return false;
   }
   urlhead = tstr.split(':');
   if (urlhead[0] == "https")
   {
        alert("<%t('URL filter for https is not supported!!')%>");
        return false;
   }
   if( urlhead[0] == "http" || urlhead[0] == "ftp" || urlhead[0] == "file" || urlhead[0] == "MMS"   || urlhead[0] == "ed2k"  || urlhead[0] == "Flashget"  || urlhead[0] == "thunder" )
   {
      if(!(/:\/\//.test(tstr)))
      {
         alert("<%t('URL is not right!')%>");
          return false;
      }
   }
   return true;

}

function ValidPortNum(portNumStr)
{
    tstr=portNumStr.trim()
    if(tstr=="") return false;
    if(!(/^\d{1,5}$/.test(tstr))) return false;
	var portNum = parseInt(tstr);
    return (portNum<=65535&&portNum>=0)
}

function ValidPortForwardingPortNum(portNumStr)
{
    tstr=portNumStr.trim()
    if(tstr=="") return false;
    if(!(/^\d{1,5}$/.test(tstr))) return false;
	var portNum = parseInt(tstr);
    return (portNum<=65535&&portNum>=1)
}

function ValidForwardingPolicy(ForwardingPolicy)
{
    tstr=ForwardingPolicy.trim()
    if(tstr=="") return false;
    if(!(/^\d{1}$/.test(tstr))) return false;
	var ForwardingP = parseInt(tstr);
    return (ForwardingP<=7&&ForwardingP>=1)
}

function Validm8021p(m8021p)
{
    tstr=m8021p.trim()
    if(tstr=="") return false;
    if(!(/^\d{1}$/.test(tstr))) return false;
    var m8021park = parseInt(tstr);
    return (m8021park<=7&&m8021park>=0)
}


function ValidPolicyFStrRoute(forwardpolicy)
{
    pfstr=forwardpolicy.trim();
    if(pfstr==-1){return true;} 
        else if(pfstr<0 || pfstr>8){return false;}
    else{return true;}
        
}  

function Validetime(etimeStr)
{
    tstr=etimeStr.trim()
    if(tstr=="") return false;
    if(!(/^\d{1,6}$/.test(tstr))) return false;
    var etime = parseInt(tstr);
    return (etime<=999999&&etime>=1)
}

function hideComuWifiWLAN(communityWifiInterface,tag)
{
    var arrayLAN = (communityWifiInterface.CommWifiInterface).split(',');
    for(var i = 0;i < arrayLAN.length;i++)
    {
        for(var k = 1;k <= 8;k++)
        {
            if(arrayLAN[i] == k)
            {
                $('#'+tag+'option[value='+k+']').remove();
                break;
            }
        }
    }
}

function hideComuWifiEntry(communityWifiInterface,tag)
{
    var arrayLAN = (communityWifiInterface.CommWifiInterface).split(',');
    for(var i = 0;i < arrayLAN.length;i++)
    {
        for(var k = 1;k <= 8;k++)
        {
            if(arrayLAN[i] == k)
            {
                $('#'+tag+'tr > *:nth-child('+(k+1)+')').hide();
                break;
            }
        }
    }
}

function unique_array(array, compare)
{
    var result = [];
    for(var i = 0, l = array.length; i < l; ++i)
    {
        var find = false;
        for(var j = 0; j<result.length;++j)
        {
            if(compare(result[j], array[i]))
            {
                find = true;
            }
        }
        if(!find)
        {
            result.push(array[i]);
        }
        
    }
    return result;
}

function isValidSubnet(address)
{
    if (address == '0.0.0.0' || address == '255.255.255.255')
        return false;

    addrParts = address.split('.');
    if ( addrParts.length != 4 ) { 
        return false;
    }
    
    if ('0' == addrParts[0]) {
        return false;
    }
    
    for (i = 0; i < 4; i++) {
        if (isNaN(addrParts[i]) || addrParts[i] =="")
            return false;
        num = parseInt(addrParts[i]);
        if ( num < 0 || num > 255 )
            return false;
    }

    var addr1 = parseInt(addrParts[0]);
    var addr2 = parseInt(addrParts[1]);
    var addr3 = parseInt(addrParts[2]);
    var addr4 = parseInt(addrParts[3]);
    if (addr1 >= 1 && addr1 <= 127) {  //A
        if (addr1 == 127) {
            return false;
        }
        if ((addr2 == 255 && addr3 == 255 && addr4 == 255)) {
            return false;
        }
    }
    else if (addr1 >= 128 && addr1 <= 191) {  //B
        if ((addr3 == 255 && addr4 == 255)) {
            return false;
        }
    }
    else if (addr1 >= 192 && addr1 <= 223) {  //C
        if (addr4 == 255 ) {
            return false;
        }
    }
    else { //D or E
        return false;
    }

    return true;
}

function IsSameIpSubnet(addr1,addr2,mask){
    if(!addr1 || !addr2 || !mask){
        return false;
    }
    var res1 = [],res2 = [];
    addr1 = addr1.split(".");
    addr2 = addr2.split(".");
    mask  = mask.split(".");
    for(var i = 0,ilen = addr1.length; i < ilen ; i += 1){
        res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
        res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
    }
    if(res1.join(".") == res2.join(".")){
        return true;
    }else{
        return false;
    }
}

function domainNameValidator(value)
{
    if (!value)
    {
        return false;
    }
    if (/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(value))
    {
        return true;
    }
    return false;
}

function isValidIpAddress(address)
{
    ipParts = address.split('/');
    if (ipParts.length > 2) return false;
    if (ipParts.length == 2) {
        num = parseInt(ipParts[1]);
        if (num <= 0 || num > 32)
            return false;
    }

    if (ipParts[0] == '0.0.0.0' || ipParts[0] == '255.255.255.255')
        return false;

    addrParts = ipParts[0].split('.');
    if ( addrParts.length != 4 ) { 
        return false;
    }
    
    if ('0' == addrParts[0]) {
        return false;
    }
    
    for (i = 0; i < 4; i++) {
        var reg = /^[0-9]*$/;
        if (!reg.test(addrParts[i])) {
            return false;
        }
        if (isNaN(addrParts[i]) || addrParts[i] =="")
            return false;
        num = parseInt(addrParts[i]);
        if(isNaN(num)||/\s/.test(addrParts[i]))
            return false;
        if ( num < 0 || num > 255 )
            return false;
    }

    var addr1 = parseInt(addrParts[0]);
    var addr2 = parseInt(addrParts[1]);
    var addr3 = parseInt(addrParts[2]);
    var addr4 = parseInt(addrParts[3]);
    if (addr1 >= 1 && addr1 <= 223 && !ipParts[1]) {  //FR_ALU02339460
        if (addr1 == 127) {
            return false;
        }
        if (addr4 == 255 || addr4 == 0) {
            return false;
        }
    }
    if (addr1 >= 1 && addr1 <= 127) {  //A
        if (addr1 == 127) {
            return false;
        }
        if ((addr2 == 255 && addr3 == 255 && addr4 == 255)
            || (addr2 == 0 && addr3 == 0 && addr4 == 0)) {
            return false;
        }
    }
    else if (addr1 >= 128 && addr1 <= 191) {  //B
        if ((addr3 == 255 && addr4 == 255)
            ||(addr3 == 0 && addr4 == 0)) {
            return false;
        }
    }
    else if (addr1 >= 192 && addr1 <= 223) {  //C
        if (addr4 == 255 || addr4 == 0) {
            return false;
        }
    }
    else { //D or E
        return false;
    }

    if (ipParts.length == 2) {
        var mask_num = 32 - parseInt(ipParts[1]);
        var ip = (addr1 << 24)|(addr2 << 16)|(addr3 << 8)|(addr4);
        var count = 1;
        for (var i = 0; i < mask_num; i++) {
            count = count * 2;
        }
        count--;

        var host_ip = (ip & count).toString(2);
        var str_mask = (count).toString(2);
        if (host_ip == "0") { //host self = 0
            return false;
        }
        else if (host_ip.length == str_mask.length){ //broadcast address
            if (host_ip.indexOf("01") < 0 && host_ip.indexOf("10") < 0) {
                return false;
            }
        }
    }

    return true;
}


function isValidIpv6AddressForQos(address){
    if(transitV6Ip(address) == "0000:0000:0000:0000:0000:0000:0000:0000" 
        || transitV6Ip(address) == "0000:0000:0000:0000:0000:0000:0000:0001"){
        return false;
    }
    return true;
}

function isValidIpAddressForQos(address)
{
    ipParts = address.split('/');
    if (ipParts.length > 2) return false;
    if (ipParts.length == 2) {
        num = parseInt(ipParts[1]);
        if (num <= 0 || num > 32)
            return false;
    }

    if (ipParts[0] == '0.0.0.0' || ipParts[0] == '255.255.255.255')
        return false;

    addrParts = ipParts[0].split('.');
    if ( addrParts.length != 4 ) { 
        return false;
    }
    
    if ('0' == addrParts[0]) {
        return false;
    }
    
    for (i = 0; i < 4; i++) {
        var reg = /^[0-9]*$/;
        if (!reg.test(addrParts[i])) {
            return false;
        }
        if (isNaN(addrParts[i]) || addrParts[i] =="")
            return false;
        num = parseInt(addrParts[i]);
        if(isNaN(num)||/\s/.test(addrParts[i]))
            return false;
        if ( num < 0 || num > 255 )
            return false;
    }

    var addr1 = parseInt(addrParts[0]);
    var addr2 = parseInt(addrParts[1]);
    var addr3 = parseInt(addrParts[2]);
    var addr4 = parseInt(addrParts[3]);
    if (addr1 >= 1 && addr1 <= 223 && !ipParts[1]) {  //FR_ALU02339460
        if (addr1 == 127) {
            return false;
        }
        if (addr4 == 255 || addr4 == 0) {
            return false;
        }
    }
    if (addr1 >= 1 && addr1 <= 127) {  //A
        if (addr1 == 127) {
            return false;
        }
        if ((addr2 == 255 && addr3 == 255 && addr4 == 255)
            || (addr2 == 0 && addr3 == 0 && addr4 == 0)) {
            return false;
        }
    }
    else if (addr1 >= 128 && addr1 <= 191) {  //B
        if ((addr3 == 255 && addr4 == 255)
            ||(addr3 == 0 && addr4 == 0)) {
            return false;
        }
    }
    else if (addr1 >= 192 && addr1 <= 223) {  //C
        if (addr4 == 255 || addr4 == 0) {
            return false;
        }
    }
    else { 
        // delete D or E
    }

    if (ipParts.length == 2) {
        var mask_num = 32 - parseInt(ipParts[1]);
        var ip = (addr1 << 24)|(addr2 << 16)|(addr3 << 8)|(addr4);
        var count = 1;
        for (var i = 0; i < mask_num; i++) {
            count = count * 2;
        }
        count--;

        var host_ip = (ip & count).toString(2);
        var str_mask = (count).toString(2);
        if (host_ip == "0") { //host self = 0
            return false;
        }
        else if (host_ip.length == str_mask.length){ //broadcast address
            if (host_ip.indexOf("01") < 0 && host_ip.indexOf("10") < 0) {
                return false;
            }
        }
    }

    return true;
}


function isValidIpWithoutMask(ipStr)
{
    var ipParts = ipStr.split('/');
    if (ipParts.length > 1) {
        return false;
    }
    return isValidIpAddress(ipStr);
}

function ValidIpStr(ipStr)
{
	return isValidIpAddress(ipStr);
}

function isValidOrEmptyIp(ipStr)
{
	return (ipStr=="0.0.0.0") ||ValidIpStr(ipStr);
}


function ValidSpecialIp(ipStr)
{
    tstr=ipStr.trim()
    if(tstr=="")return false;
    if(!(/^(\d{1,3}\.){3}\d{1,3}$/.test(tstr)))return false;

    nos= tstr.split(".");
    if((nos[0]=="192")&&(nos[1]=="168")&&(nos[2]=="2")){
            return false;
    }
    
    return true;
}

function ValidSLTMIp(ipStr)
{
    tstr=ipStr.trim()
    if(tstr=="")return false;
    if(!(/^(\d{1,3}\.){3}\d{1,3}$/.test(tstr)))return false;

    nos= tstr.split(".");
    if((nos[0]=="192")&&(nos[1]=="168")&&((nos[2]=="192") || (nos[2]=="182") )){
            return false;
    }

    return true;
}

function ValidMaskStr(maskStr)
{
    tstr=maskStr.trim()
    if(tstr=="") return false;
    if(!(/^(\d{1,3}\.){3}\d{1,3}$/.test(tstr)))return false;

    nary= tstr.split(".");
    for(var i in nary){
        if(nary[i]<0 || nary[i]>255){
            return false;
        }
    }
    var _n2bin=function(ipInt){ return (parseInt(ipInt)+256).toString(2).substring(1); }
    var bin_str = _n2bin(nary[0]) + _n2bin(nary[1]) + _n2bin(nary[2]) + _n2bin(nary[3]);
    if(-1 != bin_str.indexOf("01"))return false;
    else return bin_str.indexOf("0")+256;
}
function ValidMacAddress(macStr)
{
    tstr=macStr.trim();
       if(!(/^([0-9A-Fa-f]{1,2}:){5}[0-9A-Fa-f]{1,2}$/.test(tstr)) || tstr.length != 17) return false;
    else return true;
}
function ValidMacAddress2(macStr)
{
    //Added new routine to overcome duplicate and invalid mac entries issue ALU02136333
    valid_macaddr=/^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
    if (valid_macaddr.test(macStr.trim()) && macStr.trim().length == 17)
        return true;
    else
        return false;
}
function isUnicastMacAddress(macStr)
{
    var mac=macStr.trim().split(":");
    var tmp = parseInt(mac[0],16).toString(2);
    return tmp.charAt(tmp.length - 1) == 0;
}
function ValidAscii(str)
{
    return !/[^\x00-\xff]/g.test(str);
}
function ValidInput(str)
{
    return !/[\"\'<>]/g.test(str);
}
function ip2int(ipstr){
    var aip=ipstr.split("."); 
    for(var i in aip) {
        if(parseInt(aip[i])<16) {
            aip[i]="0"+parseInt(aip[i]).toString(16);
        } else {
            aip[i]=parseInt(aip[i]).toString(16);
        }
    }
    var nip=parseInt("0x"+aip[0]+aip[1]+aip[2]+aip[3])
    return nip;
}
function checkipv6(str)
{
	//address should not be 0 in all.
	if (str.match(/[1-9A-Fa-f]/g)==null)
		return false;

    if(!str.trim())return false;
    if(str.indexOf("/")!=-1)
        return false;
    var t=str.split("/");
    ipstr=t[0];
    if (! /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(ipstr) )
        return false;
    pl=t[1];
    if(pl){
        if(pl.isdd() && parseInt(pl)>=0 && parseInt(pl)<=128){
            return true;
        }
        return false;
    }
    return true;
}

function check_ipv6_prefix(str_prefix)
{
    if((str_prefix.search("::/") == -1) || str_prefix.match(new RegExp("::/","g")).length > 1 )
        return false;
    var mask = str_prefix.split("::/")[1];
    if( Number(mask) <1 || Number(mask) >128)
    {
        return false;
    }
    if(str_prefix.split("::/")[0] == "")
        return true;
    var prefix_addr = str_prefix.split("::/")[0].split(":");
    if(prefix_addr.length > 4)
        return false;
    for(var i = 0; i < prefix_addr.length; i++)
    {
        if(!(/^[0-9A-Fa-f]{1,4}$/.test(prefix_addr[i])))
            return false;
    }
    return true;
}

var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

/* @projectDescription jQuery Serialize Anything - Serialize anything (and not just forms!)
* @author Bramus! (Bram Van Damme)
* @version 1.0
* @website: http://www.bram.us/
* @license : BSD
*/

(function($) {

    $.fn.serializeAnything = function() {

        var toReturn    = [];
        var els         = $(this).find(':input').get();

        $.each(els, function() {
            if (this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))) {
                var val = $(this).val();
                toReturn.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( val ) );
            }
        });   

        return toReturn.join("&").replace(/%20/g, "+");
    }

})(jQuery);

$(document).ajaxComplete(function(e,xhr,opt){
    if(xhr.getResponseHeader("relogin")){
        top.location.href='/';
    }
})
function xalert(xhr,s){
    if(xhr.getResponseHeader("relogin")){
        top.location.href='/';
    }else{
        alert(s);
    }
}


function isValidName(name)
{
    var i = 0;

    for ( i = 0; i < name.length; i++ ) {
        if ( isNameUnsafe(name.charAt(i)) == true )
            return false;
    }
    return true;
}

function isValidName_allowSpecialChar(name)
{
    return true;
}

function isValidName_allowMaxLength(name,maxlen)
{
	var len = name.length;
	if(len <= maxlen)
    	return true;
    else
    	return false;
}



function isNameUnsafe(compareChar)
{

    //var unsafeString = "\"<>%\\^[]`\+\$\,='#&@.: \t";
    //var unsafeString = "\"<>()\\^`\+\\,'&\t";    
    var unsafeString = "\"<>\\^`\+\\,'&\t";    

    if ( unsafeString.indexOf(compareChar) == -1
        && compareChar.charCodeAt(0) > 31
        && compareChar.charCodeAt(0) < 123 )
    {
        return false; // found no unsafe chars, return false
    }
    else
    {
        return true;
    }
}

function isValidHexKey(val, size)
{
    var ret = false;
    if (val.length == size) {
        for ( i = 0; i < val.length; i++ ) {
            if ( isHexaDigit(val.charAt(i)) == false ) {
                break;
            }
        }
        if ( i == val.length ) {
            ret = true;
        }
    }

    return ret;
}


function isHexaDigit(digit)
{
    var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
    var len = hexVals.length;
    var i = 0;
    var ret = false;

    for (i = 0; i < len; i++)
    {
        if ( digit == hexVals[i] )
        {
            ret = true;
            break;
        }
    }

    return ret;
}

function isValidName_ASCII(name)
{
    var reg = /^[a-z0-9]{0,40}$/i;
    return reg.test(name);
}

function isPrintableString(name)
{
    var regex = /^[\u0020-\u007e\u00a0-\u00ff]*$/;
    return regex.test(name);
}

function checkDomain(domain)
{
    if(domain.length > 255)
    {
        return false;
    }

     var patrn=/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/;


    if(patrn.test(domain))
    {
        return true;
    }
    return false;    
}

function disable_all_buttons()
{
    $(":button").prop("disabled",true);
    $(":submit").prop("disabled",true);
}

function refresh()
{
    window.location.replace(location.protocol + '//' + location.host + location.pathname);
}

 function isltIE(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if lt IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}
function getBrowser() {  
    var ua = window.navigator.userAgent;  
    var isIE = false;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');
    if ((old_ie > -1) || (new_ie > -1)) {
        isIE = true;
    }
    var isFirefox = ua.indexOf("Firefox") != -1;  
    var isOpera = window.opr != undefined;  
    var isChrome = ua.indexOf("Chrome") && window.chrome;  
    var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;  
    if (isIE) {  
        return "IE";  
    } else if (isFirefox) {  
        return "Firefox";  
    } else if (isOpera) {  
        return "Opera";  
    } else if (isChrome) {
        return "Chrome";  
    } else if (isSafari) {
        return "Safari";  
    } else {
        return "Unkown";  
    }
}
function convertToProtocolName(ProtocolNumber){
    var ProtocolName = "NaN";
    switch(ProtocolNumber){
        case -1 :
            ProtocolName = "None";
            break;
        case 1 :
            ProtocolName = "ICMP";
            break; 
        case 2 :
            ProtocolName = "IGMP";
            break;
        case 6 :
            ProtocolName = "TCP";
            break;
        case 17 :
            ProtocolName = "UDP";
            break;
    }
    return ProtocolName;
}

function checkOverLapping(srcPort, srcPortEnd, pm)
{
    if(isNaN(srcPort)||isNaN(srcPortEnd))
    {
        return false;
    }
	if(srcPortEnd == 0 && pm.X_ASB_COM_ExternalPortEnd == 0)
	{
		return srcPort == pm.ExternalPort;
	}
	
	if(srcPort == 0 && pm.ExternalPort == 0)
	{
		return true;
	}
	
	if(srcPort == 0 || pm.ExternalPort == 0)
	{
		return false;
	}
	
	if(srcPortEnd == 0 )
	{
		return srcPort >= pm.ExternalPort && srcPort <= pm.X_ASB_COM_ExternalPortEnd;
	}
	
	if(pm.X_ASB_COM_ExternalPortEnd  == 0 )
	{
		return pm.ExternalPort >= srcPort && pm.ExternalPort <= srcPortEnd;
	}
	
	return !(srcPort>pm.X_ASB_COM_ExternalPortEnd || srcPortEnd<pm.ExternalPort);
}
function isV6LocalLinkAddr(ipStr)
{
    var ipStart = ipStr.substring(0,4);
    var prefix_addr = parseInt(ipStart,16)
    if (prefix_addr >= 65152 && prefix_addr <= 65215){//fe80 to febf is local link address
        return true;
    }
    return false;
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

//Complete IPv6 address
function transitV6Ip(ipaddr){
    if(!ipaddr){
        return;
    }
    var ipaddress = ipaddr.split("/");
    var ipaddrs = ipaddress[0].split(":");
    var zeros = ["0000","000","00","0",""];
    for(var i=0;i<ipaddrs.length;i++){
        len = ipaddrs[i].length ? ipaddrs[i].length : 0;
        ipaddrs[i] = zeros[len] + ipaddrs[i];
    }
    if(ipaddrs.length<8){
        var count = 0;
        for(var i=0;i<ipaddrs.length;i++){
            if(ipaddrs[i]=="0000"){
                if(count==1){
                    ipaddrs[i] = addZeroForIpv6Addr(4);
                    continue;
                }
                ipaddrs[i] = addZeroForIpv6Addr((9-ipaddrs.length)*4);
                count++;
            }else{
                ipaddrs[i] += ":";
            }
        }
    }else if(ipaddrs.length==8){
        for(var i=0;i<8;i++){
            ipaddrs[i] += ":";
        }
    }
    var iparray ="";
    for(var i=0;i<ipaddrs.length;i++){
        iparray+=ipaddrs[i];
    }
    if(iparray.charAt(iparray.length-1)==':'){
        iparray = iparray.substr(0,iparray.length-1);
    }
    return iparray;
}
function addZeroForIpv6Addr(num){
    var zerostr = "";
    for(var i=1;i<num+1;i++){
        zerostr+="0";
        if(i%4==0){
            zerostr+=":";
        }
    }
    return zerostr;
}

// insert a string every X characters
function Xreplace (str,length,mark){
    var re = new RegExp("\\d{1,"+length+"}","g");
    var ma = str.match(re);
    return ma.join(mark);
}

function count(o) {
    var t = typeof o;
    if(t == 'string') {
        return o.length;
    }
    else if(t == 'object') {
        var n = 0;
        for(var i in o) {
            n++;
        }
        return n;
    }
    return false;
}
//0: equal; 1:first > second; 2: first < second
function ipv6AddrCompare(first, second) {
    var fAddr = first.split("/");
    var sAddr = second.split("/");
    var fAddrs = fAddr[0].split(":");
    var sAddrs = sAddr[0].split(":");
    for(var i = 0 ; i<fAddrs.length;i++){
        if(parseInt(fAddrs[i],16) > parseInt(sAddrs[i],16)){
            return 1;
        }else if(parseInt(fAddrs[i],16) < parseInt(sAddrs[i],16)){
            return 2;
        }
    }
    return 0;
}

function checkBusyLanPorts() {
   var tempBusyLanPorts = 0;
    for (i = 1;i <= lanNum;i++) {
        if ($("input[name='b_lan" + i +"']").prop('checked')) {
            tempBusyLanPorts ++;
        }
    }
    return tempBusyLanPorts;
}

function validateBridgeWanMesh() {

    /* Alert me while creating second bridge Wan */
    var isAnotherBridgedWan = 0;
    $.map (wan_conns,function(conn,idx) {
        var connMode =  $("select[name='conn_mode']").val();
        var conn_id = $("select[name='conn_id']").val();
        with (conn) {
            if (pppConns.length) {
                $.map (pppConns,function(ppp_conn,i) {
                    if (ppp_conn.ConnectionType == "PPPoE_Bridged" && ppp_conn._iid != conn_id && connMode == "B") {
                        isAnotherBridgedWan = 1;
                    }
                })
            }
        }
    })
    if (isAnotherBridgedWan) {
        alert ("only one bridge wan connection is allowed");
        return false;
    }

            /* Alert me when Bridged SSID and route SSID are same */
    var ssidNameArr = wlan_name.ssid_name ? (wlan_name.ssid_name).split(',') : [];
    if ( $("input[name='b_ssid1']").prop("checked") || $("input[name='b_ssid2']").prop("checked") ||
        $("input[name='b_ssid3']").prop("checked")  || $("input[name='b_ssid4']").prop("checked") ||
        $("input[name='b_ssid5']").prop("checked")  || $("input[name='b_ssid6']").prop("checked") ||
        $("input[name='b_ssid7']").prop("checked")  || $("input[name='b_ssid8']").prop("checked")) {

        var ssidSelected = [];
        var ssidNotSelected = [];
        $("input[name='b_ssid1']").prop("checked") ? ssidSelected.push(ssidNameArr[0]) : ssidNotSelected.push(ssidNameArr[0]);
        $("input[name='b_ssid2']").prop("checked") ? ssidSelected.push(ssidNameArr[1]) : ssidNotSelected.push(ssidNameArr[1]);
        $("input[name='b_ssid3']").prop("checked") ? ssidSelected.push(ssidNameArr[2]) : ssidNotSelected.push(ssidNameArr[2]);
        $("input[name='b_ssid4']").prop("checked") ? ssidSelected.push(ssidNameArr[3]) : ssidNotSelected.push(ssidNameArr[3]);
        $("input[name='b_ssid5']").prop("checked") ? ssidSelected.push(ssidNameArr[4]) : ssidNotSelected.push(ssidNameArr[4]);
        $("input[name='b_ssid6']").prop("checked") ? ssidSelected.push(ssidNameArr[5]) : ssidNotSelected.push(ssidNameArr[5]);
        $("input[name='b_ssid7']").prop("checked") ? ssidSelected.push(ssidNameArr[6]) : ssidNotSelected.push(ssidNameArr[6]);
        $("input[name='b_ssid8']").prop("checked") ? ssidSelected.push(ssidNameArr[7]) : ssidNotSelected.push(ssidNameArr[7]);

        if (ssidSelected.some(function(val,idx){ if(ssidNotSelected.indexOf(val) !== -1) return 1; else return 0;})) {
            alert("SSID associated with bridged WAN should not have same name as L3 SSID. Ensure SSID names are unique in Wireless (2.4GHz)/Wireleess (5GHz) page.");
            return false;
        }
    }

    /* Warn me when All Lan ports are busy */
    var isAllLanUsed = 1;
    if(busyLanPorts != lanNum) {
        var currentBusyLanPorts = checkBusyLanPorts();
        if(currentBusyLanPorts == lanNum) {
            var confirm = window.confirm('This will move all Lan port to L2 domain and no Lan ports can be used for backhaul. Are you sure, you want to continue?');
            if (confirm != true) {
                return false;
            }
        }
    }
    return true;
}

function formatTime(time) {
    if(time == ""){
        return null;
    }
    var date = new Date("1900/1/1 " + time);
    if (isNaN(date)) {
        return null;
    }
    var hour = date.getHours();
    var min = date.getMinutes();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (min < 10) {
        min = "0" + min;
    }
    return (hour + ":" + min);
}

function handleBackhaulL3domainLAN(lan_ether,wlan_route,MeshandGuestList,sourceinterface) {
    $.each(lan_ether,function(i,e) {
        if (MeshandGuestList.indexOf(e.Name) !== -1 || sourceinterface.indexOf(e.Name) !== -1) {

            $("input[name='b_lan" + i + "']").attr("disabled",true);
        }
    });
    $.each(wlan_route,function(i,e) {
        if (sourceinterface.indexOf(e.Name) !== -1) {
            $("input[name='b_ssid" + (i+1) + "']").attr("disabled",true);
        }
    });
	$.map(MeshandGuestList,function(val,idx) {
        switch (val.trim()) {
            case 'SSID1': $("input[name='b_ssid1']").attr("disabled",true);
                break;
            case 'SSID2': $("input[name='b_ssid2']").attr("disabled",true);
                break;
            case 'SSID3': $("input[name='b_ssid3']").attr("disabled",true);
                break;
            case 'SSID4': $("input[name='b_ssid4']").attr("disabled",true);
                break;
            case 'SSID5': $("input[name='b_ssid5']").attr("disabled",true);
                break;
            case 'SSID6': $("input[name='b_ssid6']").attr("disabled",true);
                break;
            case 'SSID7': $("input[name='b_ssid7']").attr("disabled",true);
                break;
            case 'SSID8': $("input[name='b_ssid8']").attr("disabled",true);
                break;
        }
    });
}

function hidePorts(hasL2IsolationMesh,lanNum,guestListSsid,domain_group,lan_ether,wlan_route) { 
    var MeshandGuestList = guestListSsid.MeshandGuestList ? guestListSsid.MeshandGuestList : [];
    var sourceinterface = domain_group.sourceinterface ? domain_group.sourceinterface.split(',') : [];
    $("input[name='b_ssid1']").prop("disabled",true); /* default behaviour for Bridged Wan over Mesh */
    $("input[name='b_ssid5']").prop("disabled",true); /* default behaviour for Bridged Wan over Mesh */

    /* Disable Routed and Guest Wifi Associated Lan ports */
    handleBackhaulL3domainLAN(lan_ether,wlan_route,MeshandGuestList,sourceinterface);
    busyLanPorts = checkBusyLanPorts();
}
