import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import EditPage from "./pages/EditPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ListPage/>}/>
                <Route path="/details/:id" element={<DetailsPage/>}/>
                <Route path="/edit/:id" element={<EditPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
