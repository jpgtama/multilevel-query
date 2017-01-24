var retrievedFHIRResourceDict= {}
function update_value_PQ_list(fhir_rb){
    //fhir_rb['entry'][0]['resource']
    for(var i= 0; i< fhir_rb['entry'].length; i++){
        var fhir_r = fhir_rb['entry'][i]
        var _rType = fhir_r['resource']['resourceType']
        if (!(_rType in retrievedFHIRResourceDict)){
            retrievedFHIRResourceDict[_rType] = []
        }
        retrievedFHIRResourceDict[_rType].push(fhir_r)
    }
}
function getRuleName(ruleSourceCode){
    reg = /\s*rule\s*(\w+)/gi
    var _stringRuleName = '';
    if(reg.test(ruleSourceCode)){
        //rule_name = 'diagnosisWith'
        _stringRuleName = RegExp.$1
    }
    return _stringRuleName
}

function call_sci(fhirSeviceRootURL, patient_rid,  ruleSource, rule_name){
    var _stringRuleName = getRuleName(ruleSource)
    //var _patientResourceID = patient_rid
    var _patient = {'rid': patient_rid}
    var vEMR_model = $('#sci_model').html()
    //var source = pageData['rule_source']
    //compile the source. The name option is required if compiling directly.
    var flow = nools.compile(ruleSource + vEMR_model, {name: "simple"})
    session = flow.getSession();
    var theInstance = null;
    if (['ageGT18', 'ageLT70'].indexOf(_stringRuleName)>=0){
        Patient = flow.getDefined("Patient")

        var birthDate = get_fhir_resource('Patient', _patient['rid'], 'birthDate' )
        if (!birthDate){
            return false
        }
        var today = new Date().toLocaleDateString()
       //var age = calculateAge("01/23/1998", "11/14/2016")
        var age = calculateAge(birthDate, "2016-11-14")
        var thePatient = new Patient("male",age)
        
        theInstance = thePatient
        
    }
    
    //template for other classes
    if ([].indexOf(_stringRuleName)>=0){
        //
        ;
    }
    if (['diagnosisWith'].indexOf(_stringRuleName)>=0){
        Diagnosis = flow.getDefined("Diagnosis")
        _patient['referenceType'] = 'patient.reference'
        var _params = ['category.coding.code=11535-2|urn:oid:2.16.840.1.113883.6.1|主要诊断']
        query_fhir(fhirSeviceRootURL, 'Condition', _patient, _params)
        if('Condition' in retrievedFHIRResourceDict){
            var _conditionList = retrievedFHIRResourceDict['Condition'];
            var tripleConceptList = []
            
            for(var i=0; i<_conditionList.length; i++){
                var _dx = _conditionList[i]['resource'];                
                for(var j=0; j< _dx['code']['coding'].length; j++){
                    var _concept = _dx['code']['coding'][j]
                    tripleConceptList.push('11535-2|肝细胞癌|urn:oid:2.16.840.1.113883.3.143.1')
                }
            }
            var _theDiagnosis = new Diagnosis(tripleConceptList);
            
        }else{
            var _theDiagnosis = new Diagnosis([]);
        }
        theInstance = _theDiagnosis;
    }

    if (['rule_PQ'].indexOf(_stringRuleName)>=0){
        //
        Observation = flow.getDefined("Observation"),
        query_fhir(_patient['rid'], 'Observation', [])
    var theObservation = null;
    if(value_PQ_list.length > 0){
        var fhir_ob = value_PQ_list[0]
        var value_PQ = fhir_ob['valueQuantity']['value']
        var theObservation = new Observation(value_PQ)
        
        theInstance = theObservation;
    }
    
            
    }
    
    session.assert(theInstance);
    session.match();
    nools.deleteFlow(flow);
    return theInstance.isQualified

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

function query_fhir(fhirServiceRootURL, resourceName, patient, params){
    //var fhir_root_url = 'http://localhost:3000/'
    //url =  fhir_root_url + resource_name + '/Patient-10020?_format=json'
    //var _url =  fhir_root_url + resourceName + '?'
    var _url =  fhirServiceRootURL + resourceName + '?'
    //var _patientResourceID = patient_rid
    var _patientResourceID = patient['rid']
    var _referenceKey = patient['referenceType']
    //url = url + 'subject.reference=Patient/' + _patientResourceID
    //_url = _url + 'subject.reference=Patient/' + _patientResourceID
    _url = _url + _referenceKey +'=Patient/' + _patientResourceID
    if (params.length > 0){
        _url = _url + '&' + params.join('&')
    }
    var fhir_rb; 
    $.ajax({ 
                type: 'GET',
                async:false,                
                url: _url, 
                dataType: 'json',
                username: '',
                password: '',
                success: function(response){
                    fhir_rb = response;
                    update_value_PQ_list(fhir_rb)
                },
                
                error: function(data){
                    console.log('failed to get FHIR resource')
                }
                })

    //return fhir_rb['entry'][0]['resource'];
}



function get_fhir_resource(resource_name, resource_id, attr_name){
    //var fhir_root_url = 'http://localhost:3000/'
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