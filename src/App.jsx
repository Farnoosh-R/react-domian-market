import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HashRouter } from "react-router-dom";
import Offers from './pages/offers'
import Domains from './pages/domians';
import Partnership from './pages/partnership';

export function useScrollAnimation() {
  
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-anim");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);
}


function App() {
 useScrollAnimation();

  return (
    <>
    <Routes>
      <Route path='/' element={<Offers />} />
      <Route path='/domain/:domain' element={<Offers />} />
      <Route path='/domains' element={<Domains />}/>
      <Route path='/partnership' element={<Partnership />}/>
    </Routes>
    </>
  )
}

export default App
