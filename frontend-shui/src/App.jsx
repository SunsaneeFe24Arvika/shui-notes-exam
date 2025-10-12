import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';

function App() {
  
  return (
    <section className="app">
      <RouterProvider router={ router } />
    </section>
  )
}

export default App