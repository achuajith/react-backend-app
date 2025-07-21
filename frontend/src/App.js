import { useEffect, useState } from 'react';

function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: '',
    age: '',
    breed: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/pets`)
      .then(res => res.json())
      .then(setPets);
  }, [backendUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('age', form.age);
    formData.append('breed', form.breed);
    formData.append('image', imageFile);

    const res = await fetch(`${backendUrl}/api/pets/upload`, {
      method: 'POST',
      body: formData,
    });
    console.log(res);

    if (res.ok) {
      const updatedPets = await fetch(`${backendUrl}/api/pets`).then(res => res.json());
      setPets(updatedPets);
      setForm({ name: '', age: '', breed: '' });
      setImageFile(null);
    } else {
      alert('Failed to add pet');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pet Adoption</h1>

      <h2>Add a New Pet</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required /><br /><br />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required /><br /><br />
        <input type="text" name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} required /><br /><br />
        <input type="file" accept="image/*" onChange={handleImageChange} required /><br /><br />
        <button type="submit">Add Pet</button>
      </form>

      <hr />

      <h2>Adoptable Pets</h2>
      <ul>
        {pets.map((pet, idx) => (
          <li key={idx} style={{ marginBottom: '20px' }}>
            <strong>{pet.name}</strong> ({pet.age} years old) - {pet.breed}<br />
            {pet.imageUrl && <img src={pet.imageUrl} alt={pet.name} width={200} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
