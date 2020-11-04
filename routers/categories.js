const { Router } = require("express");
const User = require("../models").user
const Listing = require("../models").listing
const Category = require("../models").category
const router = new Router();


router.get('/', async (req, res, next) => {
    try {
        const allCategories = await Category.findAll({
            include: [
                { model: Listing },
            ]
        })
        res.send(allCategories)
    } catch (e) {
        next(e)
    }
})


module.exports = router;