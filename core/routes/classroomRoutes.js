const express = require('express');
const classRoomController = require('./../controllers/classRoomController');
const protect = require('./../middlewares/protect');

const router = express.Router();


router
	.route('/:parentId')
	.post(protect, classRoomController.setParentId, classRoomController.createClassRoom)

router
	.route('/')
	.post(protect, classRoomController.setParentId, classRoomController.createClassRoom)
	.get(classRoomController.getAllClassRooms);

router
	.route('/:id')
	.patch(classRoomController.updateClassRoom)
	.delete(classRoomController.beforeDelete, classRoomController.deleteClassRoom)
	.get(classRoomController.getOneClassRoom)


router.route('/rename/:refId').patch(protect, classRoomController.renameClassRoom);
router.route('/:slug/:parentId').patch(classRoomController.moveClassRoom);


router
	.route('/decendants/:classRoomId')
	.get(classRoomController.getDecendants)

module.exports = router;
