import {Container, CssBaseline, Typography} from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import {Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/users/usersSlice.ts";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import Recipes from "./features/recipes/Recipes.tsx";
import NewRecipe from "./features/recipes/NewRecipe.tsx";
import FullRecipe from "./features/recipes/FullRecipe.tsx";
import UserRecipes from "./features/recipes/UserRecipes.tsx";

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
                      <Route path="/" element={<Recipes />}/>
                      <Route path="/login" element={<Login/>} />
                      <Route path="/register" element={<Register/>} />
                      <Route path="/recipes/:id" element={<FullRecipe/>}/>
                      <Route path="/users/:userId/recipes" element={<UserRecipes />} />

                      {/*<Route*/}
                      {/*    path="/recipes/my-recipes"*/}
                      {/*    element={*/}
                      {/*        <ProtectedRoute isAllowed={Boolean(user)}>*/}
                      {/*            <UserRecipes isOwnProfile={true} />*/}
                      {/*        </ProtectedRoute>*/}
                      {/*    }*/}
                      {/*/>*/}
                      <Route
                          path="/recipes/new"
                          element={
                              <ProtectedRoute isAllowed={Boolean(user)}>
                                  <NewRecipe />
                              </ProtectedRoute>
                          }
                      />

                      <Route path="*" element={<Typography variant="h4">Not found page</Typography>} />
                  </Routes>
              </Container>
          </main>
      </>
  );
};

export default App;
