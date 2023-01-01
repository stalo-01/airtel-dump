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
                          ]
              }, 
              {   name:"<%T('Network')%>", 
                   target:0,
                    nodes:[
                            <% if has_TR then %>
                            {
                                    name:"<%T('TR-069')%>",
                                    target:"tr69.cgi"
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
                            <% if shown_in_route then %>
                            {
                                    name:"<%T('NTP')%>",
                                    target:"sntp.cgi"
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