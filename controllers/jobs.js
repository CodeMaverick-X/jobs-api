const Job = require('../models/Job')
const { NotFoundError, BadRequestError } = require('../errors')

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create({ ...req.body })
    res.status(201).json({ job })
}

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ 'createdBy': req.user.userId }).sort('createdAt')
    res.status(200).json({ 'jobs': jobs, 'count': jobs.length })

}

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    const job = await Job.findOne({ createdBy: userId, _id: jobId })
    if (!job) {
        throw new NotFoundError(`no job with id ${jobId}`)
    }
    res.status(200).json({ job })
}

const updateJob = async (req, res) => {
    const { body: { company, position },
        params: { id : jobId },
        user: { userId },
    } = req
    if (!company || !position) {
        throw new BadRequestError('company or position field cannot be emty')
    }
    const job = await Job.findByIdAndUpdate({
        _id: jobId,
        createdBy: userId
    }, req.body,
        { new: true, runValidators: true })

        if (!job) {
            throw new NotFoundError(`no job with id ${jobId}`)
        }
        res.status(200).json({job})
}

const deleteJob = async (req, res) => {
    const {user : {userId}, params : {id : jobId}} = req
    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId})
    if (!job) {
        throw new NotFoundError(`no job with id ${jobId}`)
    }
    res.status(200).send()
}
module.exports = {
    createJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob
}