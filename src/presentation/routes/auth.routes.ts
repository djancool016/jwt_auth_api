import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router()
const auth = AuthController

router.post('/login', auth.login)
router.get('/profile', auth.profile)
router.get('/auth', auth.authenticateToken)
router.get('/refresh', auth.refresh)

module.exports = router

