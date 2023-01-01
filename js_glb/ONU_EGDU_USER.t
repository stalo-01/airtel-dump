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
                            {
                                    name:"<%T('Statistics')%>",
                                    target:"statistics.cgi"
                            },
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
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('LAN_IPv6')%>",
                                    target:"lan_ipv6.cgi"
                            },
                            <% end %>
                            <% if has_wifi_24G then %>
                            {
                                    name:"<%T('Wireless (2.4GHz)')%>",
                                    target:"wlan_config.cgi"
                            },
                            <% end %>
                            <% if has_wifi_5G then %>
                            {
                                    name:"<%T('Wireless (5GHz)')%>",
                                    target:"wlan_config.cgi?v=11ac"
                            },
                            <% end %>
                            <% if has_wifi_24G then %>
                            {
                                    name:"<%T('Wireless Schedule')%>",
                                    target:"wifi_schedule.cgi"
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
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('MAC Filter')%>",
                                    target:"macfilter.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('IP Filter')%>",
                                    target:"ipfilter.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('URL Filter')%>",
                                    target:"urlfilter.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('Parental Control')%>",
                                    target:"parental_control.cgi"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Application')%>", 
                   target:0,
                    nodes:[
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('Port Forwarding')%>",
                                    target:"nat_glb.cgi?v=vhost"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('DDNS')%>",
                                    target:"ddns.cgi"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Maintenance')%>", 
                   target:0,
                    nodes:[
                            {
                                    name:"<%T('Password')%>",
                                    target:"user_glb.cgi"
                            },
                            {
                                    name:"<%T('Reboot Device')%>",
                                    target:"reboot.cgi"
                            },
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