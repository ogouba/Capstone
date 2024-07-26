import "./App.css";
import { UserContext } from "./UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import HomePage from "./components/Profile";
import Notifications from "./components/Notifications";
import WatchLater from "./components/WatchLater";
import { useAuth } from "./hooks";
function App() {
    const [user, updateUser] = useAuth();
    return (
        <div className="app">
            <BrowserRouter>
                <UserContext.Provider value={{ user, updateUser }}>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/newpost" element={<HomePage />} />
                        <Route path="/notifications" element={<Notifications />}/>
                        <Route path="/watchLater" element={<WatchLater />}/>
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </div>
    );
}
export default App;
