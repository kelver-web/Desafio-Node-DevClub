const express = require('express');
const uuid = require('uuid');
const port = 4000

const app = express();
app.use(express.json())

const orders = []

const middleware = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(orderId => orderId.id === id)

    if(index < 0) {
        return response.status(404).json({message: "Order not found!"})
    }
    
    request.index = index
    request.id = id
    
    console.log('Request URL:', request.originalUrl)
    console.log('Request Type:', request.method)

    next()
}

app.middlewareVerbs = (request, response, next) => {
    console.log('Request Type:', request.method);
    next()
}

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.get('/orders/:id', middleware, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.id
    
    const uniqueOrder = { id, order, clientName, price, status }
    const orderId = orders.filter( element => element.id === id)

    return response.json(orderId)
})

app.post('/orders', (request, response) => {
    const { order, clientName, price, status } = request.body
    const orderUser = { id: uuid.v4(), order, clientName,  price, status }

    orders.push(orderUser)

    return response.status(201).json(orders)
})

app.put('/orders/:id', middleware, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.index
    const id = request.id

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder
    return response.json(orders)
})

app.delete('/orders/:id', middleware, (request, response) => {
    const index = request.id
    orders.splice(index, 1)

    return response.status(200).json({message: "User deleted!"})
})

app.patch('/orders/:id', middleware, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.id

    const newStatusOrder = { id, order, clientName, price, status }
    const newStatus = orders.filter( element => element.id === id).map( element => {
        const news = {
            id: element.id,
            order: element.order,
            clientName: element.clientName,
            price: element.price,
            status: 'Pronto'
        }
        return response.json(news)
    })
})



app.listen(port, () => {
    console.log(`🚀 server started on port ${port}`)
})