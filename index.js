const express  = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

const orders = []

const midleware = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex( order => order.id === id )

    if (index < 0) { return response.status(404).json({ message: 'Id not found' }) }

    request.id = id
    request.index = index

    next()
}

const middlewareVerbs = (request, response, next) => {
    console.log(`[${request.method}] - ${request.url}`)
    next()
}

app.get("/order", middlewareVerbs, (request, response) => {
    return response.json(orders)
})

app.get("/order/:id", midleware, middlewareVerbs, (request, response) => {
    const id = request.id
    const orderId = orders.filter( element => element.id === id)

    return response.json(orderId)

})

app.post("/order", middlewareVerbs, (request, response) => {
    const { order, clientName, price, status } = request.body
    const clientOrder = { id:uuid.v4(), order, clientName, price, status }

    orders.push(clientOrder)

    return response.json(orders)
})

app.put("/order/:id", midleware, middlewareVerbs, (request, response) => {
    const id = request.id
    const index = request.index
    const { order, clientName, price, status } = request.body

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete("/order/:id", midleware, middlewareVerbs, (request, response) => {
    const index = request.index

    orders.splice(index, 1)
    return response.status(201).json({ message: "User deleted successifuly!"})
})

app.patch("/order/:id", midleware, middlewareVerbs, (request, response) => {
    const id = request.id
   
    const newStatus = orders.filter( element => element.id === id)
    newStatus.map( element => {
        const news = {
            id: element.id,
            order: element.order,
            clientName: element.clientName,
            price: element.price,
            status: 'Pedido Pronto'
        }
        return response.json(news)
    })
})



app.listen(port, () => {
    console.log(`[nodemon] run in port ${port}`)
})
