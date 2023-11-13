import './App.css';

function App() {
  return (
    <div className="App">
    {/* Banner */}
    <header className="banner">
      <h1>GSU Poster Voting</h1>
    </header>

    {/* Main Content */}
    <main className="content">
      {/* Your main web app content goes here */}
      <h2>Main Content Area</h2>
      <p>This is where your main web app content will be displayed.</p>
    </main>

    {/* Footer with Static Links */}
    <footer className="footer">
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </footer>
  </div>
);
}

export default App;
