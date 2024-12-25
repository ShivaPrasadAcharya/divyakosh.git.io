const App = () => {
  return (
    <div className="App">
      <SpiritualDictionary />
    </div>
  );
};

// Render the app
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
