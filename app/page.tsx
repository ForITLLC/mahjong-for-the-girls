import Nav from './components/Nav';
import Hero from './components/Hero';
import WhatItIs from './components/WhatItIs';
import WhoItsFor from './components/WhoItsFor';
import Events from './components/Events';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatItIs />
        <WhoItsFor />
        <Events />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
