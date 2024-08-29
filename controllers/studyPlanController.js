const StudyPlan = require("../models/studyPlanModel");

const getAllStudyPlan = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.find().populate(
      "courses schedule.courseId"
    );
    if (!studyPlan)
      return res.status(404).json({ message: "Study Plan not found" });
    res.status(200).json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudyPlanById = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findById(req.params.id).populate(
      "courses schedule.courseId"
    );
    if (!studyPlan)
      return res.status(404).json({ message: "Study Plan not found" });
    res.status(200).json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudyPlan = async (req, res) => {
    try{
        const newStudyPlan = new StudyPlan(req.body);
        const savedStudyPlan = await newStudyPlan.save();
        res.status(201).json(savedStudyPlan);
    }catch(error){
        res.status(500).json({message : error.message});
    }
};

const updateStudyPlan = async (req , res) => {
    try{
        const updatedStudyPlan = await StudyPlan.findByIdAndUpdate(req.params.id , req.body, {new: true});
        if(!updatedStudyPlan) return res.status(404).json({message: 'Study Plan not found'})
        res.status(200).json(updatedStudyPlan);
    }catch (error){
        res.status(500).json({message: error.message});
    }
}

const deleteStudyPlan = async (req , res) => {
    try{
        const deleteStudyPlan = await StudyPlan.findByIdAndDelete(req.params.id);
        if(!deleteStudyPlan) return res.status(404).json({message: 'Study Plan not found'})
        res.status(200).json({message: 'Study Plan deleted successfully' });
    }catch(error){
        res.status(500).json({message : error.message });
    }
}

module.exports = {
    createStudyPlan,
    getAllStudyPlan,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan
}