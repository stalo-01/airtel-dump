$.fn.set_default = function(oid) {

    if(urlParams[oid])
    {
        return this.val(urlParams[oid]);
    }
    else
    {
    	if(this.children().length > 0)
        	return this.val( this.children()[0].value );         
    }
}

$.fn.set_checked = function(value) {
    return this.prop("checked",Boolean(value)).change();
}
