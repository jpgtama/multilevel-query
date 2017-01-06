function call_sci(pageData){
    console.log(pageData)
    var patient_rid = '1'
    
    
    var model_source = $('#sci_model').html()
    var source = pageData['rule_source']
       //compile the source. The name option is required if compiling directly.
    
    console.log(source + model_source)
    var flow = nools.compile(source + model_source, {name: "simple"}),
    Patient = flow.getDefined("Patient"),
    Observation = flow.getDefined("Observation"),
    session = flow.getSession();
    
    var birthDate = get_fhir_resource('Patient', patient_rid, 'birthDate' )
    console.log(birthDate)
    var today = new Date().toLocaleDateString()
   //var age = calculateAge("01/23/1998", "11/14/2016")
    var age = calculateAge(birthDate, "2016-11-14")
    var thePatient = new Patient("male",age)
    session.assert(thePatient);
    
    
    http://loinc.org|33914-3
    var fhir_ob = query_fhir('282', 'Observation', ['http://loinc.org|Y1'])
    var value_PQ = fhir_ob['valueQuantity']['value']
    
    
    
    var theObservation = new Observation(value_PQ)
    session.assert(theObservation);
    session.match();
    //nools.deleteFlows();
    nools.deleteFlow(flow);
    if(theObservation.isQualified){
        thePatient.isQualified = true;
    }
    
    return thePatient.isQualified
}
function calculateAge (birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

function query_fhir(patient_rid, resource_name, params){
    var fhir_root_url = 'http://localhost:3000/'
    //url =  fhir_root_url + resource_name + '/Patient-10020?_format=json'
    var url =  fhir_root_url + resource_name + '?'
    var ptid = patient_rid
    url = url + 'subject.reference=Patient/' + ptid
    if (params.length > 0){
        url = url + '&' + params.join('&')
    }
    console.log(url)
    var fhir_rb; 
    $.ajax({ 
                type: 'GET',
                async:false,                
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    fhir_rb = response;
                },
                
                error: function(data){
                    console.log('failed to get FHIR resource')
                }
                })
    console.log(fhir_rb)
    return fhir_rb['entry'][0]['resource'];
}



function get_fhir_resource(resource_name, resource_id, attr_name){
    var fhir_root_url = 'http://localhost:3000/'
    //url =  fhir_root_url + resource_name + '/Patient-10020?_format=json'
    url =  fhir_root_url + resource_name
    var ptid = resource_id
    if (resource_name == 'Patient'){
    
        url =  url + '/' + ptid + '?_format=json'
    }else{
        url =  url + '?_format=json'
        if ($('#popup_mode').val() == 'data'){
            url = url + '&patient=Patient/' + ptid
        }
    }
    
    console.log(url)
    var fhir_r; 
    $.ajax({ 
                type: 'GET',
                async:false,                
                url: url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    fhir_r = response;
                },
                
                error: function(data){
                    console.log('failed to get PMML xml list')
                }
                })
    return fhir_r[attr_name]
}