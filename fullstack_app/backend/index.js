const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ket noi MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/student_db';
mongoose.connect(mongoURI)
    .then(() => console.log("Da ket noi MongoDB thanh cong"))
    .catch(err => console.error("Loi ket noi MongoDB:", err));

// API lay danh sach hoc sinh
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// api them hoc sinh
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// api lay thong tin mot hoc sinh
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// api cap nhat hoc sinh
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStu = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStu) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(updatedStu);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// api xoa hoc sinh
app.delete('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Student.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Đã xóa học sinh", id: deleted._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
});
