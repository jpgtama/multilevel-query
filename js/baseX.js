function getPMMLXML(PMMLFileName){
    var url = 'http://localhost:8080/BaseX844/rest/' + sci_params['baseX_DB_name'] + '/' + PMMLFileName
            $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'text',
                username: 'admin',
                password: 'admin',
                success: function(response){
                    var selected_data_type = 'unknown'
                    $('#PMMLEnditor').val(response)
                    if(PMMLFileName.indexOf('.xml')>=0){
                        var selected_data_type = 'PMML'
                    }else if (PMMLFileName.indexOf('.pmml')>=0){
                        var selected_data_type = 'PMML'
                    }else if (PMMLFileName.indexOf('.txt')>=0){
                        var selected_data_type = 'FlatTable'
                    }else{
                    }
                    
                    
                    $('#model_file_type option[value="' + selected_data_type + '"]').prop("selected",true);
                },
                
                error: function(data){
                    console.log('failed to get PMML xml list')
                }
                })

}


function getPMMLXMLList(){
    console.log('http://localhost:8080/BaseX844/rest/' + sci_params['baseX_DB_name'] + '?method=json&json=format=jsonml')
    var url = 'http://localhost:8080/BaseX844/rest/' + sci_params['baseX_DB_name'] + '?method=json&json=format=jsonml'
            $.ajax({ 
                type: 'GET', 
                url: url, 
                dataType: 'json',
                username: 'admin',
                password: 'admin',
                success: function(response){
                    //response in jsonML format
                    //http://www.jsonml.org/
                    var xmlList = [{'value':'', 'text':''}]
                    for (i =2; i< response.length; i++){
                        console.log(response[i][0], response[i][2])
                        var resourceName = response[i][2];
                        
                        xmlList.push({'value':resourceName, 'text':resourceName})
                    }
                    var items = xmlList
                    //items = [{'value':'', 'text':''}, {'value':'modelA', 'text':'ModelA'}];
                    $.each(items, function (i, item) {
                    $('#select_a_model').append($('<option>', { 
                        value: item.value,
                        text : item.text 
                    }));
                    
                    
                    
                });
                
                },
                error: function(data){
                    console.log('failed to get PMML xml list')
                }
                })
}