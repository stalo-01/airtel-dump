  
    function Exclude_check(){ 

        //check the input validation when che Exclude is checked
        var do_break = false; 
        $.map($("input[type=checkbox]"), function(checkbox){
            var $checkbox = checkbox;
          
            var $checkbox_name = $checkbox.getAttribute("name");
            
            if($("input[name="+$checkbox_name+"]").attr("checked")){
                var $target_elment = $checkbox.getAttribute("targeattr");
                console.log("checkbox targeattr is ", $target_elment);
    
                if($target_elment && $.trim($("input[name="+$target_elment+"]").val()) == ''){
                    alert("this is empty!");
                    $("input[name="+$target_elment+"]").focus();
                    do_break = true
                    return false;       
                }
            }
        })
        if(do_break){
            return false;
        }

        return true;
    }
      
    function DSCP_802_range_check(source, range){
        if(source){
            if(!ValidPortNum(source)){
                return false;
            }
            else if(parseInt(source) > parseInt(range)){
                return false
            }
        }

        return true;
    }

