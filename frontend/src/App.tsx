import {Container, CssBaseline, Typography} from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import {Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import AdminLayout from "./features/admin/AdminLayout.tsx";
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";


const App = () => {
    const user = useAppSelector(selectUser);

  return (
      <>
          <CssBaseline />
          <ToastContainer />
          <header>
              <AppToolbar />
          </header>
          <main>
              <Container maxWidth="xl" sx={{py: 3}}>
                  <Routes>
                      {/*<Route path="/" element={<Groups/>}/>*/}
                      {/*<Route path="/groups" element={<Groups/>}/>*/}
                      <Route path="/login" element={<Login/>} />
                      <Route path="/register" element={<Register/>} />

                      {/*<Route*/}
                      {/*    path="/groups/new"*/}
                      {/*    element={*/}
                      {/*        <ProtectedRoute isAllowed={!!user}>*/}
                      {/*            <NewGroups />*/}
                      {/*        </ProtectedRoute>*/}
                      {/*    }*/}
                      {/*/>*/}

                      {/*<Route path="/groups/:id" element={<FullGroup />} />*/}

                      {/*<Route*/}
                      {/*    path="/my-groups"*/}
                      {/*    element={*/}
                      {/*        <ProtectedRoute isAllowed={!!user}>*/}
                      {/*            <MyGroupsList />*/}
                      {/*        </ProtectedRoute>*/}
                      {/*    }*/}
                      {/*/>*/}

                      <Route path='admin' element={
                          <ProtectedRoute isAllowed={user && user.role === 'admin'}>
                              <AdminLayout/>
                          </ProtectedRoute>
                      }>
                          {/*<Route path="groups" element={<AdminGroupsList />} />*/}
                      </Route>

                      <Route path="*" element={<Typography variant="h4">Not found page</Typography>} />
                  </Routes>
              </Container>
          </main>
      </>
  );
};

export default App;
