import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../pages/Login';
import Recipes from '../pages/Recipes';
import RecipeDetails from '../pages/RecipeDetails';
import RecipeInProgress from '../pages/RecipeInProgress';
import DoneRecipes from '../pages/DoneRecipes';
import FavoriteRecipes from '../pages/FavoriteRecipes';
import Profile from '../pages/Profile';

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path={ ['/meals', '/drinks'] } component={ Recipes } />
      <Route
        exact
        path={ ['/meals/:id', '/drinks/:id'] }
        component={ RecipeDetails }
      />
      <Route
        exact
        path={
          ['/meals/:id/in-progress', '/drinks/:id/in-progress']
        }
        component={ RecipeInProgress }
      />
      <Route path="/done-recipes" component={ DoneRecipes } />
      <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      <Route path="/profile" component={ Profile } />
    </Switch>
  );
}

export default Routes;
