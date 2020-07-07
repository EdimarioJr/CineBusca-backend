import express from 'express'

const routes = express.Router()

routes.get('/',(req,res)=>{
    return res.send('GET HOMEPAGE')
})

routes.post('/login',(req,res)=>{
    return res.send('login usuario')
})

export default routes;