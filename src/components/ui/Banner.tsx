import { Container, Row, Col } from 'react-bootstrap';
import {default as JsonData} from "../../data/data.json";
import { Link } from "react-router-dom";


export function Banner()
{
    return(
        <><header id='home'>
        <div className='intro'>
          <div className='overlay'>
            <Container>
                <Row>
                <Col md={{ span: 8, offset: 2 }} className=' intro-text'>
                  <h1 className="animate__animated animate__fadeInDown">
                  {JsonData ? JsonData.Header.title : 'Loading'}
                  <span></span>
                  </h1>
                  <p className="animate__animated animate__fadeInUp">
                  {JsonData ? JsonData.Header.paragraph : 'Loading'}
                  </p>
                  <Link
                  to="/servicos"
                  className="btn btn-outline-light btn-lg page-scroll px-5 py-3 fs-4"
                  >
                   Conheça nossos serviços <i className="bi bi-arrow-right-circle me-3 ms-2"></i> 
                  </Link>{' '}
                </Col>
                </Row>
            </Container>
          </div>
        </div>
      </header>
      </>
    )
    
}
