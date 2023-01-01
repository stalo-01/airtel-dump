var all_nodes= { 
     name:"all_nodes",
     target:0,
     nodes:[
              {   name:"<%T('Status')%>", 
                   target:0,
                    nodes:[
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
                            <% if is_hybrid then %>
                            {
                                    name:"<%T('LTE Status')%>",
                                    target:"lte_management.cgi?status"
                            },
                            <% end %>
                            {
                                    name:"<%T('Home Networking')%>",
                                    target:"lan_status.cgi?wlan"
                            },
                            {
                                    name:"<%T('DSL Statistics')%>",
                                    target:"dsl_status.cgi?dsl"
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
                            {
                                    name:"<%T('WAN')%>",
                                    target:"wan_config_glb.cgi"
                            },
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('WAN DHCP')%>",
                                    target:"wan_dhcp.cgi"
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
                            {
                                    name:"<%T('IP Routing')%>",
                                    target:"route.cgi"
                            },
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('DNS')%>",
                                    target:"dns.cgi"
                            },
                            <% end %>
                            <% if has_TR then %>
                            {
                                    name:"<%T('TR-069')%>",
                                    target:"tr69.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('QoS Config')%>",
                                    target:"qos.cgi"
                            },
                            <% if has_mesh then %>
                            {
                                    name:"<%T('MESH')%>",
                                    target:"mesh.cgi"
                            },
                            <% end %>
                            <% if is_hybrid then %>
                            {
                                    name:"<%T('MPTCP Config')%>",
                                    target:"wanport_mptcp_config.cgi"
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
                                    name:"<%T('MAC Filter')%>",
                                    target:"macfilter.cgi"
                            },
                            <% end %>
                            <% if has_gfast_protocol then %>
                            {
                                    name:"<%T('Service Access Control')%>",
                                    target:"protocolcfg.cgi"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Application')%>", 
                   target:0,
                    nodes:[
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
                            <% if has_voice_setting then %>
                            {
                                    name:"<%T('Voice Setting')%>",
                                    target:"voice_setting.cgi?v=cfg_line"
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
                            <% if is_hybrid then %>
                            {
                                    name:"<%T('LTE management')%>",
                                    target:"lte_management.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('Backup and Restore')%>",
                                    target:"usb.cgi?backup"
                            },
                            <% if  has_pse then %>
                            {
                                    name:"<%T('Reverse Power')%>",
                                    target:"reverse_power.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('Firmware Upgrade')%>",
                                    target:"upgrade.cgi"
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
           ]
}