def test_create_project(client, auth_header):
    resp = client.post(
        "/api/projects",
        json={"name": "My AI System"},
        headers=auth_header,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "My AI System"
    assert data["risk_classification"] == "minimal"


def test_list_projects(client, auth_header):
    client.post("/api/projects", json={"name": "Project 1"}, headers=auth_header)
    client.post("/api/projects", json={"name": "Project 2"}, headers=auth_header)
    resp = client.get("/api/projects", headers=auth_header)
    assert resp.status_code == 200
    assert len(resp.json()) >= 2


def test_get_project(client, auth_header):
    create_resp = client.post("/api/projects", json={"name": "Test"}, headers=auth_header)
    project_id = create_resp.json()["id"]
    resp = client.get(f"/api/projects/{project_id}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Test"


def test_get_project_not_found(client, auth_header):
    resp = client.get("/api/projects/00000000-0000-0000-0000-000000000000", headers=auth_header)
    assert resp.status_code == 404


def test_update_project(client, auth_header):
    create_resp = client.post("/api/projects", json={"name": "Original"}, headers=auth_header)
    project_id = create_resp.json()["id"]
    resp = client.patch(
        f"/api/projects/{project_id}",
        json={"name": "Updated"},
        headers=auth_header,
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated"


def test_delete_project(client, auth_header):
    create_resp = client.post("/api/projects", json={"name": "To Delete"}, headers=auth_header)
    project_id = create_resp.json()["id"]
    resp = client.delete(f"/api/projects/{project_id}", headers=auth_header)
    assert resp.status_code == 200
    resp = client.get(f"/api/projects/{project_id}", headers=auth_header)
    assert resp.status_code == 404


def test_projects_require_auth(client):
    resp = client.get("/api/projects")
    assert resp.status_code == 422
