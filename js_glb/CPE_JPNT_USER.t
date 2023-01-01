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
                          ]
              }, 
              {   name:"<%T('Network')%>", 
                   target:0,
                    nodes:[
                            {
                                    name:"<%T('VLAN')%>",
                                    target:"vlan_config.cgi"
                            },
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
                            {
                                    name:"<%T('Firmware Upgrade')%>",
                                    target:"upgrade.cgi"
                            },
                          ]
              }, 
           ]
}