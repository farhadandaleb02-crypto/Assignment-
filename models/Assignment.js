import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  instructions: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  dueDate: Date,
});

export default mongoose.model("Assignment", assignmentSchema);