import Header from './components/home-fizzi/Header';
import Footer from './components/home-fizzi/Footer';
import Hero from './components/home-fizzi/Hero';
import SkyDive from './components/home-fizzi/SkyDive';
import Carousel from './components/home-fizzi/Carousel';
import AlternatingText from './components/home-fizzi/AlternatingText';
import BigText from './components/home-fizzi/BigText';
import ViewCanvas from './components/home-fizzi/ViewCanvas';

export default function Home() {
  return (
    <div className="bg-yellow-300">
      <Header />
      <main>
        <Hero />
        <SkyDive />
        <Carousel />
        <AlternatingText />
        <BigText />
        <ViewCanvas />
      </main>
      <Footer />
    </div>
  );
}
