sci_params = {
    'baseX_DB_name': 'SCI.PMMLs',
    'PMML_FIELD_COLUMN_NAME': 'Field id',
    'PMML_DATATYPE_COLUMN_NAME': 'data type',
    'CDS_CONTEXT': 'sci_pilot',
    'PATIENT_ID': 'df2fcff5-5dc4-4197-b855-38ef3915c984',//http://fhirtest.uhn.ca/baseDstu2/
    'iCMC_SCI_ROOT': 'http://localhost:6543/iCMC/sci/'
}

function setContext(){
    $('#context').html(sci_params['CDS_CONTEXT'])
}