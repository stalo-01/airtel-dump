
function SetCwinHeight() {
    var iframeid = document.getElementById("mainFrame"); //iframe id
    iframeid.height = 1;
    if (document.getElementById) {
        if (iframeid && !window.opera) {
            if (iframeid.contentDocument && iframeid.contentDocument.body.offsetHeight) {
                iframeid.height = iframeid.contentDocument.body.offsetHeight;
            } else if (iframeid.Document && iframeid.Document.body.scrollHeight) {
                iframeid.height = iframeid.Document.body.scrollHeight;
            }
        }
    }

}
/* get url parameters */
function getHashVars()
{
    var vars = [], hash;
    if (self.document.location.hash.length == 0)
    {
        if (self.document.location.href.indexOf('#') >= 0) {
            self.document.location.hash = self.document.location.href.indexOf('#');
        } else {
            self.document.location.hash = '#sub=0';
            //self.document.location.hash = "#" + self.document.location.href.slice(self.document.location.href.indexOf('%23') + 3);
        }
        //console.log(self.document.location.hash);
    }
    if (self.document.location.hash.indexOf('#') >= 0)
    {
        var hashes = self.document.location.hash.slice(self.document.location.hash.indexOf('#') + 1).split('&');
    } else
    {
        var hashes = self.document.location.hash.slice(self.document.location.hash.indexOf('%23') + 3).split('&');
    }
    /////////////console.log(hashes);
    for (var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

activeThisSubmenu = function (submenu) {
        //if(chkUserDataModification()) return false;
        // get submenu and subsubmenu
        $(".menuItem").removeClass("active");
        submenu.addClass("active");
        var index = $(".menuItem").index(submenu);
        var heightItem=0;
        for(var i =0; i<index;i++){
            heightItem += submenu.parent("#sidebar").children().eq(i).height();
        }
        if (index !== undefined) {
            var p = 27 + heightItem;
            p = p + "px";
            // change window title
            document.title = submenu.children('a').text();
            //justin modify end
            // indicating arrow
            $('#indicator').css('left', '208px');
                $('#indicator').show().animate({top: p});
            }
        }
function widthNavbar(num){
    if(num > 5){
      $("#header li a").css("width","160px");
    }
}
$(function () {
    var navbar = $("#navbar");
    for (var key in all_nodes.nodes) {
        var nodes = all_nodes.nodes[key];
        if(!$.isEmptyObject(nodes.nodes)){
        var menu =
                $("<li class='nav-item' id='" + key + "' ><a href='#'  >" + nodes.name +
                        "</a></li>");
         navbar.append(menu);
         widthNavbar(key);
        }
    }

    $(".nav-item").click(function () {
        var nodes = all_nodes.nodes[$(this).attr('id')];
        $(".nav-item").removeClass("active");
        $(this).addClass("active");
        var sidebar = $("#sidebar");
        sidebar.empty();

        //console.log(nodes);
        for (var index in nodes.nodes) {
            var node = nodes.nodes[index];
            if (index === "0") {
                sidebar.append($("<li class='menuItem active' content='" + node.target + "'><a href='#sub=" + index + "' class='menu-item' >" + node.name + "</a></li>"));
            } else {
                sidebar.append($("<li class='menuItem' content='" + node.target + "'><a href='#sub=" + index + "' class='menu-item'>" + node.name + "</a></li>"));
            }
        }
        $(".menuItem").click(function () {
            activeThisSubmenu($(this));
            $("#mainFrame").attr("src", $(this).attr("content"));
            $("#mainFrame").attr("name", $(this).children().html());
            $("#menu-title").html('<h1><span>'+$(this).children().html()+'</span></h1>');
            return true;
        });
        $(".menu-item").eq(0).click();
    });
    $(".nav-item").eq(0).click();
   
});


