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
                            <% if is_optics then %>
                            {
                                    name:"<%T('Optics Module Status')%>",
                                    target:"wan_status.cgi?gpon"
                            },
                            <% end %>
                          ]
              }, 
              {   name:"<%T('Network')%>", 
                   target:0,
                    nodes:[
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
                            <% if is_allow_onu_mode_switch then %>
                            {
                                    name:"<%T('SFU or HGU Mode Switch')%>",
                                    target:"onu_mode_switch.cgi"
                            },
                            <% end %>
                            {
                                    name:"<%T('Password')%>",
                                    target:"user_glb.cgi"
                            },
                            {
                                    name:"<%T('LOID Configuration')%>",
                                    target:"reg.cgi?loidcfg"
                            },
                            <% if is_optics then %>
                            {
                                    name:"<%T('SLID Configuration')%>",
                                    target:"gpon_config.cgi"
                            },
                            <% end %>
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