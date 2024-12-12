import {Router} from 'express'
import urlCtrl from '../controllers/urlController.js'
import authCtrl from '../controllers/authController.js'

const router = Router()

router.post('/short',authCtrl.protect, urlCtrl.createSort)
router.get('/myUrls',authCtrl.protect, urlCtrl.getUserUrls)

router.get('/r/:sortUrl', urlCtrl.accessUrl)
router.get('/url/:id', authCtrl.protect, urlCtrl.getUrl)


export default router