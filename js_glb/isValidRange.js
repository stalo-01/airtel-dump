function isValidRange(start_ip, end_ip) {
	var mask = "255.255.0.0";
	var mask_arr = mask.split(".");

	var start_ip_arr = start_ip.split(".");
	var end_ip_arr = end_ip.split(".");
	
	var res1 = [], res2 = [];

	var last_bit_equal = true;

	for(var i = 0,ilen = start_ip_arr.length; i < ilen ; i += 1) {
		res1.push(parseInt(start_ip_arr[i]) & parseInt(mask_arr[i]));
		res2.push(parseInt(end_ip_arr[i]) & parseInt(mask_arr[i]));

		if(last_bit_equal){
			if(parseInt(start_ip_arr[i])>parseInt(end_ip_arr[i])){
				return false;
			}else if(parseInt(start_ip_arr[i])<parseInt(end_ip_arr[i])){
				last_bit_equal = false;
			}
		}
	}

	if(res1.join(".") == res2.join(".")) {
		return true;
	} else {
		return false;
	}
}