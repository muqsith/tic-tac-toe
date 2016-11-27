import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Game from './game.jsx';

render( <AppContainer><Game /></AppContainer>, document.querySelector("#container"));

if (module.hot) {
  module.hot.accept('./game.jsx', () => {
    const Game = require('./game.jsx').default;
    render(
      <AppContainer>
        <Game />
      </AppContainer>,
      document.querySelector("#container")
    );
  });
}
