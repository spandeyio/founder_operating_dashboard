from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from app.utils.db import get_db_connection

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    conn = get_db_connection()
    history = []
    
    if conn:
        try:
            cur = conn.cursor()
            cur.execute("SELECT role, content FROM chat_history ORDER BY id DESC LIMIT 5")
            rows = cur.fetchall()
            # Chronological order
            for role, content in reversed(rows):
                history.append({"role": role, "content": content})
        except Exception as e:
            print(f"Error fetching history: {e}")
        finally:
            cur.close()
            conn.close()
    else:
        print("Warning: Database connection failed. Skipping chat history fetch.")
        
    return templates.TemplateResponse("index.html", {"request": request, "history": history})
