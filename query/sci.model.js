



define Patient {
    message : "",
    constructor : function (gender, birthDate){
        this.gender = gender;
        this.birthDate = birthDate;
        this.age = sci_calculateAge("02/24/1991", "02/24/2010")
        this.isQualified = false;
    }
}
