import express from 'express'
import bootStrap from "./src/app.controller.js"



const app = express()
const port = 3000

await bootStrap(app, express)


app.listen(port, () => console.log(`Server app listening on port ${port}!`))
