def test_create_invite(client, auth_header):
    resp = client.post(
        "/api/invites",
        json={"email": "newuser@example.com", "role": "member"},
        headers=auth_header,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["token"]
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "member"
    assert data["used_at"] is None


def test_create_invite_without_email(client, auth_header):
    resp = client.post(
        "/api/invites",
        json={"role": "admin"},
        headers=auth_header,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] is None
    assert data["role"] == "admin"


def test_create_invite_requires_admin(client):
    client.post(
        "/api/auth/register",
        json={"email": "first@example.com", "password": "password123", "name": "First"},
    )
    invite_resp = client.post(
        "/api/invites",
        json={"email": "new@example.com", "role": "member"},
        headers={"Authorization": "Bearer first_token"},
    )
    assert invite_resp.status_code == 401


def test_validate_invite(client, auth_header):
    create_resp = client.post(
        "/api/invites",
        json={"email": "newuser@example.com", "role": "member"},
        headers=auth_header,
    )
    token = create_resp.json()["token"]

    validate_resp = client.get(f"/api/invites/{token}/validate")
    assert validate_resp.status_code == 200
    data = validate_resp.json()
    assert data["valid"] is True
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "member"


def test_validate_invalid_token(client):
    resp = client.get("/api/invites/nonexistent-token/validate")
    assert resp.status_code == 200
    assert resp.json()["valid"] is False


def test_list_invites(client, auth_header):
    client.post(
        "/api/invites",
        json={"email": "a@example.com"},
        headers=auth_header,
    )
    client.post(
        "/api/invites",
        json={"email": "b@example.com"},
        headers=auth_header,
    )
    resp = client.get("/api/invites", headers=auth_header)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_delete_invite(client, auth_header):
    create_resp = client.post(
        "/api/invites",
        json={"email": "delete@example.com"},
        headers=auth_header,
    )
    invite_id = create_resp.json()["id"]

    delete_resp = client.delete(f"/api/invites/{invite_id}", headers=auth_header)
    assert delete_resp.status_code == 200

    list_resp = client.get("/api/invites", headers=auth_header)
    assert len(list_resp.json()) == 0


def test_register_with_invite(client, auth_header):
    create_resp = client.post(
        "/api/invites",
        json={"email": "invited@example.com", "role": "member"},
        headers=auth_header,
    )
    token = create_resp.json()["token"]

    reg_resp = client.post(
        "/api/auth/register",
        json={
            "email": "invited@example.com",
            "password": "password123",
            "name": "Invited User",
            "invite_token": token,
        },
    )
    assert reg_resp.status_code == 200
    assert "access_token" in reg_resp.json()

    validate_resp = client.get(f"/api/invites/{token}/validate")
    assert validate_resp.json()["valid"] is False
