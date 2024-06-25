const { getItemsOpts } = require("../../schema/v1/items")

const items = [
    {id:1, name: "item1", description:"item 1 descritpion"},
    {id:2, name: "item2", description:"item 2 descritpion"},
    {id:3, name: "item3", description:"item 3 descritpion"},
    {id:4, name: "item4", description:"item 4 descritpion"},
]

const itemRoutes = (fastify, options, done) => {

    fastify.get("/items", (req, rep) => {
        return items
    })
    fastify.get("/items/:id",getItemsOpts, (req, rep) => {
        const id = parseInt(req.params.id)
        const item = items.find(i => i.id === id)
        return item
    })
    done()
}

module.exports = {
    itemRoutes
}