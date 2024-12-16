import {Router} from 'express'
import urlCtrl from '../controllers/urlController.js'
import authCtrl from '../controllers/authController.js'

const router = Router()

router.post('/short',authCtrl.protect, urlCtrl.createSort)
router.get('/myUrls',authCtrl.protect, urlCtrl.getUserUrls)

router.get('/:sortUrl', urlCtrl.accessUrl)
router.get('/url/:id', authCtrl.protect, urlCtrl.getUrl)
router.put('/url/:id', authCtrl.protect, urlCtrl.editUrl)
router.delete('/url/:id', authCtrl.protect, urlCtrl.delete)


export default router