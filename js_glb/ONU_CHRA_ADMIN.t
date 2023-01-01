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
                                    name:"<%T('WAN Status')%>",
                                    target:"show_wan_status.cgi?ipv4"
                            },
                            <% if is_optics then %>
                            {
                                    name:"<%T('Optics Module Status')%>",
                                    target:"wan_status.cgi?gpon"
                            },
                            <% end %>
                            <% if has_voice_info then %>
                            {
                                    name:"<%T('Voice Information')%>",
                                    target:"voice_info.cgi"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Network')%>", 
                   target:0,
                    nodes:[
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('LAN')%>",
                                    target:"lan_ipv4.cgi"
                            },
                            <% end %>
                            <% if has_mesh then %>
                            {
                                    name:"<%T('MESH')%>",
                                    target:"mesh.cgi"
                            },
                            <% end %>
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
                            <% if is_optics then %>
                            {
                                    name:"<%T('SLID Configuration')%>",
                                    target:"gpon_config.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('Reboot Device')%>",
                                    target:"reboot.cgi"
                            },
                            {
                                    name:"<%T('Factory Default')%>",
                                    target:"restore.cgi"
                            },
                            {
                                    name:"<%T('Log')%>",
                                    target:"log.cgi"
                            },
                          ]
              }, 
              {   name:"<%T('RG Troubleshooting')%>", 
                   target:0,
                    nodes:[
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('RG Troubleshoot Counters')%>",
                                    target:"rgtroubleshooting.cgi?ping"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('SmartHome')%>", 
                   target:0,
                    nodes:[
                          ]
              }, 
           ]
}