const errorHandler =  (err,req,res,next) => {
    if(process.env.NODE_ENV === 'development'){
 
    }else{
        console.log(err)
        console.log(err.name, err.message)
        res.status(err.statusCode || 500).json({error: err})
    }

    if(process.env.NODE_ENV=== 'production'){

    }
}

export default errorHandler