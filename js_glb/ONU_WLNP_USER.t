var all_nodes= { 
     name:"all_nodes",
     target:0,
     nodes:[
              {   name:"<%T('Status')%>", 
                   target:0,
                    nodes:[
                            <% if has_mesh then %>
                            {
                                    name:"<%T('Overview')%>",
                                    target:"overview.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('Device Information')%>",
                                    target:"device_status.cgi"
                            },
                            {
                                    name:"<%T('LAN Status')%>",
                                    target:"lan_status.cgi?lan"
                            },
                            {
                                    name:"<%T('WAN Status')%>",
                                    target:"show_wan_status.cgi?ipv4"
                            },
                            {
                                    name:"<%T('WAN Status IPv6')%>",
                                    target:"show_wan_status.cgi?ipv6"
                            },
                            {
                                    name:"<%T('Home Networking')%>",
                                    target:"lan_status.cgi?wlan"
                            },
                            <% if is_optics then %>
                            {
                                    name:"<%T('Optics Module Status')%>",
                                    target:"wan_status.cgi?gpon"
                            },
                            <% end %>
                            {
                                    name:"<%T('Statistics')%>",
                                    target:"statistics.cgi"
                            },
                            {
                                    name:"<%T('Forwarding Table')%>",
                                    target:"forwarding_table.cgi"
                            },
                          ]
              }, 
              {   name:"<%T('Network')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
              {   name:"<%T('Security')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
              {   name:"<%T('Application')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
              {   name:"<%T('Maintenance')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
              {   name:"<%T('RG Troubleshooting')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
              {   name:"<%T('SmartHome')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
           ]
}