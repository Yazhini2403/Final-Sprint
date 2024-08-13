import express from 'express';
import joi from 'joi';
import { User, Project } from '../models/index.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// User Routes

// Sign-up route
router.post('/signup', async (req, res) => {
    const signupSchema = joi.object({
        username: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { username, email, password } = value;
        const user = new User({ username, email, password });
        await user.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(422).json({ error: 'Username or email must be unique' });
        }
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Sign-in route
router.post('/signin', async (req, res) => {
    const signinSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { error, value } = signinSchema.validate(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    try {
        const { email, password } = value;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        // Generate a JWT token if needed
        // const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Sign-in successful' /*, token */ });
    } catch (error) {
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Project Routes

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { tasks: 0, __v: 0, updatedAt: 0 });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Get a single project by ID
router.get('/project/:id', async (req, res) => {
    if (!req.params.id) return res.status(422).send({ error: 'Id is required' });
    try {
        const data = await Project.findById(req.params.id).sort({ 'tasks.order': 1 });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Create a new project
router.post('/project', async (req, res) => {
    const projectSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const data = await new Project(value).save();
        return res.send({ title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ error: 'Title must be unique' });
        } else {
            return res.status(500).send({ error: 'Server error' });
        }
    }
});

// Update a project
router.put('/project/:id', async (req, res) => {
    const projectSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.findByIdAndUpdate(req.params.id, value, { new: true });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Delete a project
router.delete('/project/:id', async (req, res) => {
    try {
        const data = await Project.findByIdAndDelete(req.params.id);
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Add a task to a project
router.post('/project/:id/task', async (req, res) => {
    if (!req.params.id) return res.status(500).send('Server error');

    const taskSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).send('Project not found');

        const taskIndex = project.tasks.length > 0 ? Math.max(...project.tasks.map(task => task.index)) + 1 : 0;
        const data = await Project.findByIdAndUpdate(req.params.id, { $push: { tasks: { ...value, stage: 'Requested', index: taskIndex } } }, { new: true });
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Get a task by ID
router.get('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    try {
        const project = await Project.findOne(
            { _id: req.params.id, 'tasks._id': req.params.taskId },
            { 'tasks.$': 1 }
        );
        if (!project || !project.tasks.length) return res.status(404).send('Task not found');
        return res.send(project);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Update a task
router.put('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    const taskSchema = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = taskSchema.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const data = await Project.updateOne(
            { _id: req.params.id, 'tasks._id': req.params.taskId },
            { $set: { 'tasks.$.title': value.title, 'tasks.$.description': value.description } }
        );
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Delete a task
router.delete('/project/:id/task/:taskId', async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send('Server error');

    try {
        const data = await Project.updateOne(
            { _id: req.params.id },
            { $pull: { tasks: { _id: req.params.taskId } } }
        );
        return res.send(data);
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;
