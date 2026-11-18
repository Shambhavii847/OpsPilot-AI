import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app, Base, get_db


@pytest.fixture
def client(tmp_path):
    test_db = tmp_path / "test.db"

    engine = create_engine(
        f"sqlite:///{test_db}",
        connect_args={"check_same_thread": False}
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    engine.dispose()


def test_add_and_get_product(client):
    response = client.post("/api/inventory/", json={
        "name": "Test Keyboard",
        "category": "Accessories",
        "quantity": 20,
        "price": 1500,
        "reorder_level": 5
    })

    assert response.status_code == 200
    assert response.json()["name"] == "Test Keyboard"

    inventory = client.get("/api/inventory/")
    assert inventory.status_code == 200
    assert len(inventory.json()) == 1


def test_update_product(client):
    created = client.post("/api/inventory/", json={
        "name": "Test Mouse",
        "quantity": 10
    })

    product_id = created.json()["id"]

    response = client.put(
        f"/api/inventory/{product_id}",
        json={"quantity": 25}
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 25


def test_delete_product(client):
    created = client.post("/api/inventory/", json={
        "name": "Temporary Product"
    })

    product_id = created.json()["id"]

    response = client.delete(f"/api/inventory/{product_id}")

    assert response.status_code == 200
    assert response.json()["message"] == "Product deleted"

    inventory = client.get("/api/inventory/")
    assert inventory.json() == []


def test_update_missing_product(client):
    response = client.put(
        "/api/inventory/99999",
        json={"quantity": 10}
    )

    assert response.status_code == 404
