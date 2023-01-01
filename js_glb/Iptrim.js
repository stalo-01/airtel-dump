//use after check the validation of IP address
function Iptrim(valueName)
{
    var str_array = $("input[name='"+valueName+"']").val().trim().split(".");
    var IpStr_rtu = "";
    for (var i in str_array){
        IpStr_rtu += parseInt(str_array[i]).toString();
        if(i < 3)
            IpStr_rtu += ".";
    }
    $("input[name='"+valueName+"']").val(IpStr_rtu);
    return IpStr_rtu;
}

