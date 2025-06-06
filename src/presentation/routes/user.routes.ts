import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router()
const user = UserController

router.post('/register', user.register)
router.get('/:uuid', user.getByUuid)

module.exports = router

