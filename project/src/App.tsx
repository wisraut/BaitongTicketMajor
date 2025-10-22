import React from "react";
import "./App.css";
import Header from "./components/Header.tsx";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="flex-1 bg-white text-black">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <h1 className="text-2xl font-bold">Home</h1>
          <p>ของหน้าแรกตรงนี้</p>
        </div>
      </main>
    </div>
  );
}

export default App;
