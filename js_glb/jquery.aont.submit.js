var modal_alert = function(msg){
    var div = document.getElementById('modal-alert-content');
    if(div != null){
        div.parentNode.removeChild(div);
    }
    var divObj=document.createElement("div"); 
    divObj.id = 'modal-alert-content';
    divObj.innerHTML = '<div class="modal fade" id="modal_alert" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle" aria-hidden="true">\
            <div class="modal-dialog modal-dialog-centered" role="document">\
                <div class="modal-content">\
                  <div class="modal-body">\
                     '+msg+'\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
                  </div>\
                </div>\
            </div>\
           </div>';
    var first=document.body.firstChild;
    document.body.insertBefore(divObj,first);
    $('#modal_alert').modal('show');
};

var aont_validator = {
        alert_type: function(dom){
            this.validatorAlert=(dom.attr("validatorAlert") == "true")?1:0;
            return true;
        },
	error: function(message) {
		if(message !== undefined) {
                    if(this.validatorAlert){
                        modal_alert(message);
                    }else{
                        alert(message);
                    }
		}
	},

	range_check: function(value, validator) {

		var min = validator.range[0];
		var max = validator.range[1];
		if(value<min || value>max)
		{
			if(validator.range_error !== undefined)
			{
				this.error(validator.range_error.format(min, max));
			}

			return false;
		}
		
		return true;
	},

	number_check: function(value, validator) {
		if(isNaN(parseInt(value)) || parseInt(value) != value)
		{
			this.error(validator.format_error);
			return false;
		}
		return true;
	},
	sequential_check: function(value, validator) {
        var num = Number(validator.sequential);

        if (num < 2)
            return true;

        for(var i = 0;  i < value.length; i++)
        {
            var current = value.charCodeAt(i);
            var m = 0;
            for(var j = i + 1; j < value.length; j++)
            {
                var next = value.charCodeAt(j);
                if (next == current + 1)
                {
                    current = next;
                    m++;
                    if (m >= num - 1)
                    {
                        return true;
                    }
                }
                else
                {
                    break;
                }
            }
        }

        return false;
	},

    ip_check: function(value, validator) {
        if(!isValidIpAddress(value)){
            this.error(validator.error.format(validator.name));
            return false;
        }
        return true;
    },

    domain_name_check: function(value, validator) {
        if(!checkDomain(value)){
            this.error(validator.error.format(validator.name));
            return false;
        }
        return true;
    },

	regexp_check: function(value, validator) {
		var re = new RegExp(validator.regexp);
		if(!re.test(value)) {
			this.error(validator.error.format(validator.name));
			return false;
		}
		return true;
	},
	regexp_reverse_check: function(value, validator) {
		var re = new RegExp(validator.regexp_reverse);
		if(re.test(value)) {
			this.error(validator.error.format(validator.name));
			return false;
		}
		return true;
	},
        
    validate_by_validator: function(dom, validator) {
        var value = dom.val();
        console.log(validator);
        
        if($.isArray(validator)) {
            for(var i = 0; i < validator.length; ++i) {
                if(!this.validate_by_validator(dom, validator[i])){
                    return false;
                }
            }
            return true;                   
        }

        if(validator.enabled !== undefined)
		{
			if(!eval(validator.enabled))
				return true;
		}

        if(validator.type !== undefined) {
            if(validator.type == "ip") {
                return this.ip_check(value, validator);
            } else if( validator.type == "domain-name") {
                return this.domain_name_check(value, validator);
            }
        }
        else if(validator.range !== undefined) {
                return this.number_check(value, validator) &&
                        this.range_check(value, validator);
        } else if(validator.regexp !== undefined ) {
                return this.regexp_check(value, validator);
        } else if(validator.regexp_reverse != undefined) {
        		return this.regexp_reverse_check(value, validator);
        } else if(validator.sequential !== undefined) {
                var result = this.sequential_check(value, validator);
                result = Number(validator.rule_reverse) ? !result : result;
                if(!result) {
                    this.error(validator.error.format(validator.name));
                }

                return result;
        }


        return false;	
    },
        
	validate: function(dom, validate_str) {
                this.alert_type(dom);
		var validator = JSON.parse(validate_str);
		return 	this.validate_by_validator(dom, validator);	
	}
};

function need_validate(dom)
{
    if(dom.attr("disabled")){
    	return false;
    }

    var validator_enabled = dom.attr("validator-enabled");
    if(validator_enabled !== undefined)
    {
        return eval(validator_enabled);
    }
    if (dom.attr("validatorEnabled")=="disabled"){
        return false;
    }
    return true;
}



$.fn.validate = function() {
	if(!need_validate(this))
		return true;

	if(this.attr("validator") !== undefined){
		return aont_validator.validate(this, this.attr("validator"));
	}

	return true;
}

$.fn.valid_submit = function(callback) {

	var this_dom = $(this);

	var my_function = function(){
		var validator_doms = this_dom.find("input[validator]");

		for(var idx = 0; idx < validator_doms.length; ++idx) {
			var dom = $(validator_doms[idx]);

			if(!dom.validate()){
	            dom.focus();
                dom.select();
				return false;
			}
		}

		return callback.apply(this);
	}

	return this.submit(my_function);
}
