const Assignment = require('../models/assignmentModel')

const getAllAssignments = async (req , res) => {
    try {
        const assignments = await Assignment.find().populate('course').populate('submittedBy.studentId');
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignments', error });
    }
}

const getAssignmentById = async(req , res) =>{
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course').populate('submittedBy.studentId');
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignment', error });
    }
}

const createAssignment = async(req , res)=>{
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create assignment', error });
    }
}

const updateAssignment = async(req , res)=>{
    try {
        const newAssignment = new Assignment(req.body);
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create assignment', error });
    }
}

const deleteAssignment = async(req , res)=>{
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!deletedAssignment) return res.status(404).json({ message: 'Assignment not found' });
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete assignment', error });
    }
}

module.exports = {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
}