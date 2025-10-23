import mongoose from 'mongoose'

export const ReportSchema = new mongoose.Schema({
    link: String,
    start: Object,
    stop: Object,
    distance: String,
    duration: String

})

export default ReportSchema