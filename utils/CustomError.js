class customError extends Error {
    constructor(status,message){
        super();
        this.statusCode=status;
        this.message=message;
    }
}

module.exports=customError;