const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/users', async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/users',auth, async (req, res)=>{
    try{
        const users = await User.find({});
        res.status(201).send(users);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/users/me',auth, async (req, res)=>{
    try{
        res.status(201).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/users/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send();
        }
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/usersTask/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
        
        const userId = await Task.findById(_id);
        const user = await User.findOne({_id: userId.owner})
        if(!user){
            return res.status(404).send();
        }
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch('/users/:id',auth, async (req, res)=>{
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = Updates.every(e=> allowedUpdates.includes(e));
    if(!isValidOperation){
        res.status(400).send({'error': 'Invalid Operations'});
    }   
    try{
        const user  = await User.findById(req.params.id);
        Updates.forEach(Update => user[Update] = req.body[Update]);
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true});
        if(!user){
            return res.status(404).send();
        }
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.patch('/user/me',auth, async (req, res)=>{
    const Updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = Updates.every(e=> allowedUpdates.includes(e));
    if(!isValidOperation){
        res.status(400).send({'error': 'Invalid Operations'});
    }
    try{
        Updates.forEach(Update=> req.user[Update] = req.body[Update]);
        await req.user.save();
        res.status(201).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/users/:id',auth, async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send();
        }
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/user/me',auth, async (req, res)=>{
    try{
        await req.user.remove();
        res.status(201).send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/logout',auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((e)=>{
            return e.token != req.token
        });
        await req.user.save();
        res.status(200).send('success logout')
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/logoutAll',auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('success logout all sessions')
    }catch(error){
        res.status(400).send(error);
    }
})

module.exports = router