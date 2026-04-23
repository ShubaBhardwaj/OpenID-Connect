import app from "./src/app.js";
import DBConnect from "./src/common/config/db.js";


const PORT = process.env.PORT || 3000
const start = async function () {
    // DB connection
    await DBConnect()
    app.listen(PORT, ()=>{
        console.log(`Server is running at port ${PORT}`)
    })
}

start().catch((err)=>{
    console.error("Failed to start server", err)
    process.exit(1)
})