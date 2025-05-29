import React, { useContext, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from '../../context/Authcontext';
import axios from "axios";

export function Login() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", loginData);
      auth?.login(response.data.token);
    } catch (err) {
      setError("Login ou senha inválidos.");
    }
  };

  return (
    <div className="login-screen d-flex align-items-center justify-content-center vh-100">
      <Container className="text-center">
        {/* Logo */}
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

        {/* Login Form */}
        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formLogin">
                <Form.Label>Login</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu login"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
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