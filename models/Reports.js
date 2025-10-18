import mongoose from 'mongoose'

export const ReportSchema = new mongoose.Schema({
    link: String
})

export default ReportSchema