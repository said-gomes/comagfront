import React, { useState, useEffect } from "react";
import {
  Container,
  ListGroup,
  Button,
  Modal,
  Form,
  Alert,
  Image,
  Tab,
  Tabs,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { apiService, Product, Service } from "../../services/api";

type FormDataType = {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export function EditPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [servicos, setServicos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<"produtos" | "servicos">(
    "produtos"
  );
  const [currentItem, setCurrentItem] = useState<Product | Service | null>(
    null
  );
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  // Load data from the API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [produtosData, servicosData] = await Promise.all([
          apiService.getProducts(),
          apiService.getServices(),
        ]);
        setProdutos(produtosData);
        setServicos(servicosData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddClick = (section: "produtos" | "servicos") => {
    setCurrentSection(section);
    setCurrentItem(null);
    setFormData({ name: "", description: "", price: 0, category: "", image: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentItem) {
        // Update existing item
        if (currentSection === "produtos") {
          await apiService.updateProduct(currentItem.id, { ...formData, id: currentItem.id });
          setProdutos((prev) =>
            prev.map((p) => (p.id === currentItem.id ? { ...p, ...formData, id: currentItem.id } : p))
          );
        } else {
          await apiService.updateService(currentItem.id, { ...formData, id: currentItem.id });
          setServicos((prev) =>
            prev.map((s) => (s.id === currentItem.id ? { ...s, ...formData, id: currentItem.id } : s))
          );
        }
      } else {
        // Add new item
        if (currentSection === "produtos") {
          const newProduct = await apiService.createProduct({
            ...formData,
            id: crypto.randomUUID(),
          });
          setProdutos((prev) => [...prev, newProduct]);
        } else {
          const newService = await apiService.createService({
            ...formData,
            id: crypto.randomUUID(),
          });
          setServicos((prev) => [...prev, newService]);
        }
      }
      setShowModal(false);
      setFormData({ name: "", description: "", price: 0, category: "", image: "" });
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (currentSection === "produtos") {
        await apiService.deleteProduct(id);
        setProdutos((prev) => prev.filter((p) => p.id !== id));
      } else {
        await apiService.deleteService(id);
        setServicos((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <span>Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-5">
        {error}
      </Alert>
    );
  }

  return (
    <Container>
      <h1 className="text-center my-4">Gerenciar Produtos e Serviços</h1>

      <Tabs defaultActiveKey="produtos" id="edit-page-tabs" className="mb-3">
        {/* Produtos Tab */}
        <Tab eventKey="produtos" title="Produtos">
          <ListGroup>
            {produtos.map((produto) => (
              <ListGroup.Item
                key={produto.id}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={produto.image}
                    rounded
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    className="me-3"
                  />
                  <span>{produto.name}</span>
                </div>
                <div>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                      setCurrentSection("produtos");
                      setCurrentItem(produto);
                      setFormData({
                        name: produto.name ?? "",
                        description: produto.description ?? "",
                        price: produto.price ?? 0,
                        category: produto.category ?? "",
                        image: produto.image ?? "",
                      });
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(produto.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => handleAddClick("produtos")}
          >
            <FaPlus /> Adicionar Produto
          </Button>
        </Tab>

        {/* Servicos Tab */}
        <Tab eventKey="servicos" title="Serviços">
          <ListGroup>
            {servicos.map((servico) => (
              <ListGroup.Item
                key={servico.id}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={servico.image}
                    rounded
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    className="me-3"
                  />
                  <span>{servico.name}</span>
                </div>
                <div>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => {
                      setCurrentSection("servicos");
                      setCurrentItem(servico);
                      setFormData({
                        name: servico.name ?? "",
                        description: servico.description ?? "",
                        price: servico.price ?? 0,
                        category: servico.category ?? "",
                        image: servico.image ?? "",
                      });
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(servico.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => handleAddClick("servicos")}
          >
            <FaPlus /> Adicionar Serviço
          </Button>
        </Tab>
      </Tabs>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? "Editar" : "Adicionar"}{" "}
            {currentSection === "produtos" ? "Produto" : "Serviço"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL da Imagem</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditPage;