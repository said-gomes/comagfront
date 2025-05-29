import React, { useContext, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../context/Authcontext";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(loginData);
      auth?.login(data.token);
      navigate("/edicao"); // Redireciona após login bem-sucedido
    } catch (err: any) {
      setError(err.message || "Login ou senha inválidos.");
    }
  };

  return (
    <div className="login-screen d-flex align-items-center justify-content-center vh-100">
      <Container className="text-center">
        <Row className="mb-4">
          <Col>
            <img
              src="/img/logos/comag.png"
              alt="Comag Logo"
              width="120"
              height="120"
              className="mb-3"
            />
            <h2 className="text-primary">Bem-vindo!</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
              <Button variant="primary" type="submit" className="w-100">
                Entrar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;