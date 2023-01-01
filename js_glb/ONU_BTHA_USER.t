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
                            {
                                    name:"<%T('WAN')%>",
                                    target:"wan_config_glb.cgi"
                            },
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
                                    name:"<%T('Firewall')%>",
                                    target:"firewall.cgi?fire"
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
                                    name:"<%T('Parental Control')%>",
                                    target:"parental_control.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('DMZ and ALG')%>",
                                    target:"nat_glb.cgi?v=alg"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Application')%>", 
                   target:0,
                    nodes:[
                            <% if  has_port_trigger then %>
                            {
                                    name:"<%T('Port Triggering')%>",
                                    target:"nat_glb.cgi?v=thost"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('DDNS')%>",
                                    target:"ddns.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('NTP')%>",
                                    target:"sntp.cgi"
                            },
                            <% end %>
                            <% if has_usb then %>
                            {
                                    name:"<%T('USB')%>",
                                    target:"storage.cgi"
                            },
                            <% end %>
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('UPNP and DLNA')%>",
                                    target:"upnp.cgi"
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
                                    name:"<%T('Device Management')%>",
                                    target:"device_name.cgi"
                            },
                            {
                                    name:"<%T('Reboot Device')%>",
                                    target:"reboot.cgi"
                            },
                            {
                                    name:"<%T('Factory Default')%>",
                                    target:"restore.cgi"
                            },
                            {
                                    name:"<%T('Diagnostics')%>",
                                    target:"diag.cgi?ping"
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
                          ]
              }, 
              {   name:"<%T('SmartHome')%>", 
                   target:0,
                    nodes:[
                            <% if has_iot then %>
                            {
                                    name:"<%T('Status')%>",
                                    target:"iotstatus.cgi"
                            },
                            <% end %>
                            <% if has_iot then %>
                            {
                                    name:"<%T('Configuration')%>",
                                    target:"iot_config.cgi"
                            },
                            <% end %>
                            <% if has_iot then %>
                            {
                                    name:"<%T('Maintenance')%>",
                                    target:"smarthome.cgi"
                            },
                            <% end %>
                          ]
              }, 
           ]
}