import './App.css';
import Dashboard from './Dashboard';
import AuthForm from './login';

function App() {
  return (
    <div className="App">
    {/* Banner */}
    <header className="banner">
      <h1>GSU Poster Voting</h1>
    </header>
    
    {/* Main Content */}
    <main className="content">
      <Dashboard />
      <AuthForm/>
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
