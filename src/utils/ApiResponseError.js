class ApiResponse {
    constructor(statuscode, data, messege = "Success"){ 
        this.statuscode = statuscode,
        this.data = data,
        this.messege = messege
        this.statuscode < 400
    }
}