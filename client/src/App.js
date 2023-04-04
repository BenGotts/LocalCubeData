// import { BrowserRouter, Routes, Route, Link, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";

// import Home from "./pages/Home";
// import Events from "./pages/events/Events";
// import Admin from "./pages/admin/Admin";
// import RootLayout from "./layouts/RootLayout";
// import AdminLayout from "./layouts/AdminLayout";
// import AdminCompetitors from "./pages/admin/AdminCompetitors";
// import AdminEvents from "./pages/admin/AdminEvents";
// import EventRankings from "./pages/events/EventRankings";
// import EventsLayout from "./layouts/EventsLayout";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<RootLayout />}>
//       <Route path="events" element={<EventsLayout />}>
//         <Route 
//           path=":event"
//           element={<EventRankings />}
//         />
//       </Route>
//       <Route path="admin" element={<Admin />} />
//         {/* <Route path="competitors" element={<AdminCompetitors />} />
//         <Route path="events" element={<AdminEvents />} /> */}
//       {/* </Route> */}
//     </Route>
//   )
// )


// function App() {
//   return (
//     <RouterProvider router={router} />
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Events from "./pages/events/Events";
// import Admin from "./pages/admin/Admin";
// import EventRankings from "./pages/events/EventRankings";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/events" element={<Events />} />
//         <Route path="/events/:eventId" element={<EventRankings />} />
//         <Route path="/admin" element={<Admin />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Home from './pages/Home';
import Events from './pages/events/Events';
import EventRankings from './pages/events/EventRankings';
import Admin from './pages/admin/Admin';
import '@cubing/icons';
import Data from './pages/data/Data';
import DataRankings from './pages/data/DataRankings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId/:round" element={<EventRankings />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data/:eventId/:round" element={<DataRankings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
