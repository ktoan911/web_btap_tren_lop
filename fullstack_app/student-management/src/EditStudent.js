import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [stuClass, setStuClass] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/students/${id}`)
            .then(res => {
                setName(res.data.name);
                setAge(res.data.age);
                setStuClass(res.data.class);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/api/students/${id}`, {
            name, age: Number(age), class: stuClass
        })
            .then(res => {
                console.log("Đã cập nhật:", res.data);
                navigate("/");
            })
            .catch(err => console.error("Lỗi khi cập nhật:", err));
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Chinh sua thong tin hoc sinh</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Ten: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ margin: '10px 0' }}>
                    <label>Tuoi: </label>
                    <input
                        type="number"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Lop: </label>
                    <input
                        type="text"
                        value={stuClass}
                        onChange={e => setStuClass(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '20px' }}>Cap nhat</button>
            </form>
        </div>
    );
}

export default EditStudent;
