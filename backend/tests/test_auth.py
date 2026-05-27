def test_register_first_user(client):
    resp = client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "password123", "name": "Admin"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_register_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "password123", "name": "Admin"},
    )
    resp = client.post(
        "/api/auth/register",
        json={"email": "admin@example.com", "password": "password456", "name": "Admin 2"},
    )
    assert resp.status_code == 409


def test_register_second_user_requires_invite(client):
    client.post(
        "/api/auth/register",
        json={"email": "first@example.com", "password": "password123", "name": "First"},
    )
    resp = client.post(
        "/api/auth/register",
        json={"email": "second@example.com", "password": "password123", "name": "Second"},
    )
    assert resp.status_code == 403


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "password123", "name": "User"},
    )
    resp = client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "password123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "password123", "name": "User"},
    )
    resp = client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


def test_me(client, auth_header):
    resp = client.get("/api/auth/me", headers=auth_header)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"


def test_me_without_auth(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 422


def test_setup_status_empty(client):
    resp = client.get("/api/auth/setup-status")
    assert resp.status_code == 200
    assert resp.json()["needs_setup"] is True


def test_setup_status_after_register(client):
    client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "password123", "name": "User"},
    )
    resp = client.get("/api/auth/setup-status")
    assert resp.json()["needs_setup"] is False
