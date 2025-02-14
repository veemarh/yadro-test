import {BrowserRouter, Route, Routes} from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import EditPage from "./pages/EditPage.jsx";
import {DataStoreProvider} from "./services/data-store.jsx";

function App() {
    return (
        <DataStoreProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ListPage/>}/>
                    <Route path="/details/:id" element={<DetailsPage/>}/>
                    <Route path="/edit/:id" element={<EditPage/>}/>
                </Routes>
            </BrowserRouter>
        </DataStoreProvider>
    )
}

export default App
