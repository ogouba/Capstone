import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [user, setUser] = useState(() =>{
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const updatedUser = (newUser) => {
    setUser(newUser);
  };
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);
  // const [password, setPassword] = useState("");
  // const [result, setResult] = useState("");

  // const handleChangeUser = (e) =>{
  //   setUser(e.target.value);
  // }
  // const handleChangePassword = (e) => {
  //   setPassword(e.target.value);
  // }
  // const handleCreate = () => {
  //   fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`,
  //   {
  //     method: POST,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user, 
  //       password,
  //     }),
  //   })
  //   .then(response => {
  //     console.log(response)
  //     if (response.ok) {
  //       setResult("create success!");
  //     }
  //     else {
  //       setResult("failed to create!");
  //     }
  //   })
  //   .catch(error => {
  //     setResult("failed to create!");
  //   });
  // }
  // const handleLogin = () =>{
  //   fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user,
  //       password,
  //     }),
  //   })
  //   .then(response => {
  //     if (response.ok) {
  //       setResult("success!");
  //     }
  //     else {
  //       setResult("failed to login!")
  //     }
  //   })
  //   .catch(error => {
  //     setResult("failed to login!");
  //   });
  // }
  return (
    <div className="app">
      <User_RouteContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main /> } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </BrowserRouter>
      </User_RouteContext.Provider>
    </div>
  );
}
{/* <div>
<div>
  <label>user:</label>
  <input onChange={handleChangeUser} value={user}></input>
</div>
<div>
  <label>password:</label>
  <input onChange={handleChangePassword} value={password}></input>
</div>
<button onClick={handleCreate}>Create</button>
<button onClick={handleLogin}>Login</button>
<div>
 { result && <p>{result}</p>}
</div>
</div> */}
  // const [count, setCount] = useState(0)
  // return (
  //   <>
  //     <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
export default App
