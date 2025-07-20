import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/message')
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return <h1>{msg || 'Loading...'}</h1>;
}

export default App;