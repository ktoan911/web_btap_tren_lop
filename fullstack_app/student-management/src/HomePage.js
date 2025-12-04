import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [stuClass, setStuClass] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error("loi khi fetch danh sach:", error));
    }, []);

    const handleAddStudent = (e) => {
        e.preventDefault();
        const newStu = { name, age: Number(age), class: stuClass };
        axios.post('http://localhost:5000/api/students', newStu)
            .then(res => {
                console.log("da them:", res.data);
                setStudents(prev => [...prev, res.data]);
                setName("");
                setAge("");
                setStuClass("");
            })
            .catch(err => console.error("loi khi them:", err));
    };

    const handleDelete = (id) => {
        if (!window.confirm("bạn có chắc muốn xóa học sinh này?")) return;
        axios.delete(`http://localhost:5000/api/students/${id}`)
            .then(res => {
                console.log(res.data.message);
                setStudents(prevList => prevList.filter(s => s._id !== id));
            })
            .catch(err => console.error("lỗi khi xóa:", err));
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (a.name < b.name) return sortAsc ? -1 : 1;
        if (a.name > b.name) return sortAsc ? 1 : -1;
        return 0;
    });

    return (
        <div className="App">
            <h1>Danh sach hoc sinh</h1>

            <input
                type="text"
                placeholder="tìm kiếm theo tên..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
            />

            <button onClick={() => setSortAsc(prev => !prev)} style={{ marginBottom: '20px', marginLeft: '10px', padding: '5px' }}>
                sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
            </button>

            <form onSubmit={handleAddStudent} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="ho ten"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    placeholder="tuoi"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    required
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="lop"
                    value={stuClass}
                    onChange={e => setStuClass(e.target.value)}
                    required
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">them hoc sinh</button>
            </form>

            <table border="1" style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Ho ten</th>
                        <th>Tuoi</th>
                        <th>Lop</th>
                        <th>Hanh dong</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedStudents.length === 0 ? (
                        <tr>
                            <td colSpan="4">khong tim thay hoc sinh nao</td>
                        </tr>
                    ) : (
                        sortedStudents.map((student, index) => (
                            <tr key={index}>
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.class}</td>
                                <td>
                                    <Link to={`/edit/${student._id}`} style={{ marginRight: '10px' }}>sua</Link>
                                    <button onClick={() => handleDelete(student._id)}>xóa</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default HomePage;
