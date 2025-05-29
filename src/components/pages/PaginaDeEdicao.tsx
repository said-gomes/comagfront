import React, { useState, useEffect } from "react";
import {
  Container,
  ListGroup,
  Button,
  Modal,
  Form,
  Alert,
  Image as BootstrapImage,
  Tab,
  Tabs,
  Toast,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { apiService, Product, Service } from "../../services/api";

export function EditPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [servicos, setServicos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false); // Estado para controlar o Toast
  const [currentSection, setCurrentSection] = useState<"produtos" | "servicos">(
    "produtos"
  );
  const [currentItem, setCurrentItem] = useState<Product | Service | null>(
    null
  );
  const [formData, setFormData] = useState({
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
        setShowToast(true); // Exibe o Toast em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (currentItem) {
        // Update existing item
        if (currentSection === "produtos") {
          await apiService.updateProduct(currentItem.id, { ...formData });
          setProdutos((prev) =>
            prev.map((p) => (p.id === currentItem.id ? { ...p, ...formData } : p))
          );
        } else {
          await apiService.updateService(currentItem.id, { ...formData });
          setServicos((prev) =>
            prev.map((s) => (s.id === currentItem.id ? { ...s, ...formData } : s))
          );
        }
      } else {
        // Add new item
        if (currentSection === "produtos") {
          const newProduct = await apiService.createProduct(formData);
          setProdutos((prev) => [...prev, newProduct]);
        } else {
          const newService = await apiService.createService(formData);
          setServicos((prev) => [...prev, newService]);
        }
      }
      setShowModal(false);
      setFormData({ name: "", description: "", price: 0, category: "", image: "" });
    } catch (err) {
      console.error("Erro ao salvar item:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setShowToast(true); // Exibe o Toast em caso de erro
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
      setShowToast(true); // Exibe o Toast em caso de erro
    }
  };

  async function compressImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject("Erro ao criar contexto do canvas.");
            return;
          }

          // Calcula as novas dimensões mantendo a proporção
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (maxHeight / width) * height;
              width = maxWidth;
            } else {
              width = (maxWidth / height) * width;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Redimensiona a imagem no canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Converte o canvas para base64 com qualidade ajustada
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };

        img.onerror = () => reject("Erro ao carregar a imagem.");
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject("Erro ao ler o arquivo.");
      reader.readAsDataURL(file);
    });
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <Container>
      <h1 className="text-center my-4">Gerenciar Produtos e Serviços</h1>

      {/* Toast para exibir erros */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        className="position-fixed bottom-0 end-0 m-3 toast-z-index"
        style={{ zIndex: 1055 }} // Garante que o Toast fique em primeiro plano
      >
        <Toast.Header className="bg-danger text-white">
          <strong className="me-auto">Erro</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>

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
                  <BootstrapImage
                    src={produto.image}
                    rounded
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    className="me-3"
                  />
                  <span>{produto.name}</span>
                </div>
                <div>
                  <Button
                    variant="primary"
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
            onClick={() => {
              setCurrentSection("produtos");
              setCurrentItem(null);
              setFormData({ name: "", description: "", price: 0, category: "", image: "" });
              setShowModal(true);
            }}
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
                  <BootstrapImage
                    src={servico.image}
                    rounded
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                    className="me-3"
                  />
                  <span>{servico.name}</span>
                </div>
                <div>
                  <Button
                    variant="primary"
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
            onClick={() => {
              setCurrentSection("servicos");
              setCurrentItem(null);
              setFormData({ name: "", description: "", price: 0, category: "", image: "" });
              setShowModal(true);
            }}
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
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setError("Nenhum arquivo selecionado.");
                    setShowToast(true);
                    return;
                  }

                  // Validação do tamanho do arquivo (exemplo: 5MB)
                  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                  if (file.size > maxSizeInBytes) {
                    setError("O arquivo é muito grande. Tamanho máximo permitido: 5MB.");
                    setShowToast(true);
                    return;
                  }

                  try {
                    // Comprime a imagem antes de salvar
                    const compressedImage = await compressImage(file, 800, 800, 0.8); // Máximo 800x800px, qualidade 80%
                    setFormData({ ...formData, image: compressedImage });
                  } catch (err) {
                    console.error("Erro ao processar o arquivo:", err);
                    setError("Erro ao comprimir a imagem. Tente novamente.");
                    setShowToast(true);
                  }
                }}
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