const { Router } = require("express");
const User = require("../models").user
const Listing = require("../models").listing
const Category = require("../models").category
const router = new Router();


router.get('/', async (req, res, next) => {
    try {
        const allListings = await Listing.findAll({
            include: [
                { model: User },
                { model: Category }
            ]
        })
        res.send(allListings)
    } catch (e) {
        next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    const userId = parseInt(req.params.id)
    try {
        const listingsByUserId = await Listing.findAll({ where: { userId } })
        res.send(listingsByUserId)

    } catch (e) {
        next(e)
    }
})

module.exports = router;