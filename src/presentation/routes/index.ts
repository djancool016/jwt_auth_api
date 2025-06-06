import { Router } from "express";
const router = Router()

router.use('/', require('./auth.routes'))
router.use('/user', require('./user.routes'))

module.exports = router