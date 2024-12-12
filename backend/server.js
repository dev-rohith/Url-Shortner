import app from "./app/app.js";
import { configDotenv } from "dotenv";
import dbconnnection from './app/utils/db.connection.js'
configDotenv()


dbconnnection()

const port = process.env.PORT || 5000

const server = app.listen(port, () => {
    console.log(`server is running on port - ${port}`)
})

process.on('unhandledRejection', (err)=>{
   console.log('unhandled rejection shutting down !!!')
   console.log(err.name,err.message)
   server.close(()=>{
    process.exit(1)
   })
})