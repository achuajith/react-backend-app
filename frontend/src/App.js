import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/message')
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

    useEffect(() => {
    fetch('http://localhost:4000/api/image')
      .then(res => res.json())
      .then(data => setImageUrl(data.imageUrl));
  }, []);

  if (!msg || !imageUrl){
    return <h1>Loading...</h1>
  }
  return (
    <div>
    <h1>{msg}</h1>
    <h2>Image from S3</h2>
    {imageUrl && <img src={imageUrl} alt='Dog' width={500} height='auto' />}
    </div>
  )
}
export default App;