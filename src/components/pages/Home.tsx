import { Testemunhos } from '../elements/Testemunhos';
import { Galeria } from '../elements/Galeria';
import { Banner } from '../ui/Banner';
import { Navegacao } from '../Navegacao';
import { Footer } from '../ui/Footer';
import { Apresentacao } from '../ui/Apresentacao';
import { ImgCarousel } from '../ui/Carousel';
import { SobreNos } from '../elements/SobreNos';


export function Home()
{
    return(
      <>
      <Navegacao/>
      <Banner/>
      <Apresentacao/>
      <ImgCarousel/>
      <Testemunhos/>
      <Galeria/>
      <SobreNos/>
      <Footer/>
      </>
    )
    
}
