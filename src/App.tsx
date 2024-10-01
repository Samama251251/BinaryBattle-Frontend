
import './App.css'

function App() {

  return (
    <>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Hello, Tailwind!</h1>
        <p className="text-gray-600 text-center mb-6">
          Tailwind CSS is working correctly with React!
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Click Me
        </button>
      </div>
    </>
  )
}

export default App
