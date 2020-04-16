const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks',auth, async(req, res)=>{
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks',auth, async (req, res)=>{
    try{
        const tasks = await Task.find({});
        res.status(201).send(tasks);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks/me',auth, async (req, res)=>{
    try{
        // const tasks = await Task.find({owner: req.user._id});
        // res.status(201).send(tasks);
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasksByOthers/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const tasks = await Task.find({owner: _id});
        res.status(201).send(tasks);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch('/tasks/:id',auth, async (req, res)=>{
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = Updates.every(e=> allowedUpdates.includes(e));
    if(!isValidOperation){
        res.status(400).send({'error': 'Invalid Operations'});
    }   
    try{
        const task  = await Task.findById(req.params.id);
        Updates.forEach(Update => task[Update] = req.body[Update]);
        await user.save();
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true});
        if(!task){
            return res.status(404).send();
        }
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch('/tasksOwnUpdate/:id',auth, async (req, res)=>{
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = Updates.every(e=> allowedUpdates.includes(e));
    if(!isValidOperation){
        res.status(400).send({'error': 'Invalid Operations'});
    }   
    try{
        const task  = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        Updates.forEach(Update => task[Update] = req.body[Update]);
        await task.save();
        
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id',auth, async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).send({'error': 'no task is there with this id'});
        }
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/tasksOwnDelete/:id',auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send({'error': 'no task is there with this id'});
        }
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router