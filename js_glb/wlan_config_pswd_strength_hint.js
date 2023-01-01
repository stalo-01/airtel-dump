function password_strength_hint(value) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g"); 
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g"); 
    var enoughRegex = new RegExp("(?=.{6,}).*", "g"); 

    if (false == enoughRegex.test(value)) { 
        $("#level").removeClass('pw-weak'); 
        $("#level").removeClass('pw-medium'); 
        $("#level").removeClass('pw-strong'); 
        $("#level").addClass('pw-defule'); 
        //When password's length is less than 6
    } 
    else if (strongRegex.test(value)) { 
        $("#level").removeClass('pw-weak'); 
        $("#level").removeClass('pw-medium'); 
        $("#level").removeClass('pw-strong'); 
        $("#level").addClass('pw-strong'); 
        //When password's length is more than 8 and include alphabet,digt and special character all. 
    } 
    else if (mediumRegex.test(value)) { 
        $("#level").removeClass('pw-weak'); 
        $("#level").removeClass('pw-medium'); 
        $("#level").removeClass('pw-strong'); 
        $("#level").addClass('pw-medium'); 
        //When password's length is more than 7 and include two of "alphabet,digt and special character". 
    } 
    else { 
        $("#level").removeClass('pw-weak'); 
        $("#level").removeClass('pw-medium'); 
        $("#level").removeClass('pw-strong'); 
        $("#level").addClass('pw-weak'); 
        //When password's length is less than 6 even include alphabet,digt and special character all.
    } 
    return true;  
}

$(document).ready(function() {

    setTimeout(function(){
        password_strength_hint(getToggledPasswordValue($("input[name='wpaKey']")));
    }, 700);

    $("input[name='wpaKey']").keyup(function() {
        password_strength_hint($(this).val());
    });
});
