
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'opspilot.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), default="General")
    quantity = Column(Integer, default=0)
    price = Column(Float, default=0)
    reorder_level = Column(Integer, default=10)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    priority = Column(String(30), default="Medium")
    status = Column(String(30), default="pending")
    estimated_impact = Column(String(200), default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    status = Column(String(30), default="Pending")
    completed_at = Column(DateTime, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(150), nullable=False)
    description = Column(Text, default="")
    status = Column(String(50), default="Recorded")
    timestamp = Column(DateTime, default=datetime.utcnow)


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    value = Column(Text, default="")


Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# DEMO DATA
# --------------------------------------------------

def seed_demo_data(db: Session):
    if db.query(Product).count() == 0:
        products = [
            Product(name="Wireless Headphones", category="Electronics", quantity=45, price=2499, reorder_level=15),
            Product(name="Smart Watch", category="Electronics", quantity=8, price=4999, reorder_level=12),
            Product(name="Laptop Stand", category="Accessories", quantity=32, price=1299, reorder_level=10),
            Product(name="USB-C Hub", category="Accessories", quantity=6, price=1799, reorder_level=10),
            Product(name="Bluetooth Speaker", category="Electronics", quantity=24, price=2999, reorder_level=8),
            Product(name="Wireless Mouse", category="Accessories", quantity=55, price=899, reorder_level=15),
        ]
        db.add_all(products)

    if db.query(Recommendation).count() == 0:
        recommendations = [
            Recommendation(
                title="Reorder Smart Watches",
                description="Smart Watch inventory is below its reorder level. Consider replenishing stock.",
                priority="High",
                estimated_impact="Reduce potential lost sales"
            ),
            Recommendation(
                title="Review USB-C Hub Inventory",
                description="USB-C Hub stock is running low. Review supplier availability before restocking.",
                priority="High",
                estimated_impact="Improve inventory availability"
            ),
            Recommendation(
                title="Monitor Electronics Performance",
                description="Review electronics sales trends and adjust inventory planning.",
                priority="Medium",
                estimated_impact="Improve stock planning"
            )
        ]
        db.add_all(recommendations)

    if db.query(Workflow).count() == 0:
        workflows = [
            Workflow(name="Inventory Monitoring", description="Monitor stock levels and identify products requiring attention.", status="Active"),
            Workflow(name="Daily Business Analysis", description="Review business performance and generate operational insights.", status="Active"),
            Workflow(name="Recommendation Review", description="Send suggested actions for human approval.", status="Pending"),
        ]
        db.add_all(workflows)

    if db.query(AuditLog).count() == 0:
        db.add(
            AuditLog(
                action="System Initialized",
                description="OpsPilot AI demo environment initialized.",
                status="Success"
            )
        )

    db.commit()


with SessionLocal() as db:
    seed_demo_data(db)


# --------------------------------------------------
# APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="OpsPilot AI",
    description="AI Operations Agent for Businesses - Local Demo API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def add_audit(db, action, description, status="Recorded"):
    db.add(AuditLog(
        action=action,
        description=description,
        status=status
    ))
    db.commit()


def product_dict(product):
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "quantity": product.quantity,
        "price": product.price,
        "reorder_level": product.reorder_level
    }


def recommendation_dict(item):
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "priority": item.priority,
        "status": item.status,
        "estimated_impact": item.estimated_impact,
        "created_at": item.created_at.isoformat() if item.created_at else None
    }


# --------------------------------------------------
# BASIC HEALTH
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to OpsPilot AI",
        "status": "running",
        "mode": "Local Demo Mode"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


# --------------------------------------------------
# DASHBOARD
# --------------------------------------------------

@app.get("/api/dashboard/kpis")
def dashboard_kpis(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    low_stock = [p for p in products if p.quantity <= p.reorder_level]

    inventory_value = sum(
        product.quantity * product.price for product in products
    )

    pending_recommendations = db.query(Recommendation).filter(
        Recommendation.status == "pending"
    ).count()

    completed_actions = db.query(Recommendation).filter(
        Recommendation.status == "executed"
    ).count()

    return {
        "total_revenue": 186500,
        "total_orders": 342,
        "total_products": len(products),
        "low_stock_items": len(low_stock),
        "inventory_value": inventory_value,
        "pending_recommendations": pending_recommendations,
        "completed_actions": completed_actions,
        "revenue_change": 12.5,
        "orders_change": 8.2
    }
@app.get("/api/dashboard/revenue-trend")
def revenue_trend():
    values = [8500, 9200, 8800, 10500, 11200, 10800, 12500]
    today = datetime.now().date()

    return [
        {
            "date": (today - timedelta(days=6 - i)).strftime("%b %d"),
            "revenue": value
        }
        for i, value in enumerate(values)
    ]


@app.get("/api/dashboard/inventory-status")
def inventory_status(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    low = sum(1 for p in products if p.quantity <= p.reorder_level)
    healthy = len(products) - low

    return [
        {"name": "Healthy Stock", "value": healthy},
        {"name": "Low Stock", "value": low}
    ]


@app.get("/api/dashboard/recent-activities")
def recent_activities(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(8).all()

    return [
        {
            "id": log.id,
            "action": log.action,
            "description": log.description,
            "status": log.status,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        }
        for log in logs
    ]


@app.get("/api/dashboard/health")
def dashboard_health(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    if not products:
        return {"score": 100}

    low = sum(1 for p in products if p.quantity <= p.reorder_level)
    score = max(0, round(100 - (low / len(products) * 100)))

    return {"score": score, "health_score": score}


# --------------------------------------------------
# INVENTORY
# --------------------------------------------------

@app.get("/api/inventory/")
def get_inventory(db: Session = Depends(get_db)):
    return [product_dict(p) for p in db.query(Product).all()]


@app.post("/api/inventory/")
def add_product(payload: dict, db: Session = Depends(get_db)):
    product = Product(
        name=payload.get("name", "New Product"),
        category=payload.get("category", "General"),
        quantity=int(payload.get("quantity", 0)),
        price=float(payload.get("price", 0)),
        reorder_level=int(payload.get("reorder_level", 10))
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    add_audit(db, "Product Added", f"Added {product.name}")
    return product_dict(product)


@app.put("/api/inventory/{product_id}")
def update_product(product_id: int, payload: dict, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field in ["name", "category", "quantity", "price", "reorder_level"]:
        if field in payload:
            setattr(product, field, payload[field])

    db.commit()
    db.refresh(product)

    add_audit(db, "Product Updated", f"Updated {product.name}")
    return product_dict(product)


@app.delete("/api/inventory/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    name = product.name
    db.delete(product)
    db.commit()

    add_audit(db, "Product Deleted", f"Deleted {name}")
    return {"message": "Product deleted"}


@app.post("/api/inventory/reorder/{product_id}")
def reorder_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Demo only: record the proposed reorder.
    add_audit(
        db,
        "Reorder Suggested",
        f"Reorder suggested for {product.name}. No real purchase was made."
    )

    return {
        "message": "Demo reorder suggestion recorded",
        "product": product.name,
        "simulated": True
    }


# --------------------------------------------------
# ANALYTICS
# --------------------------------------------------

@app.get("/api/analytics/revenue")
def analytics_revenue(days: int = 30):
    days = max(1, min(days, 90))

    return [
        {
            "date": (datetime.now().date() - timedelta(days=days - 1 - i)).strftime("%b %d"),
            "revenue": 5000 + ((i * 137) % 7000)
        }
        for i in range(days)
    ]


@app.get("/api/analytics/orders")
def analytics_orders(days: int = 30):
    days = max(1, min(days, 90))

    return [
        {
            "date": (datetime.now().date() - timedelta(days=days - 1 - i)).strftime("%b %d"),
            "orders": 8 + ((i * 7) % 20)
        }
        for i in range(days)
    ]


@app.get("/api/analytics/product-performance")
def product_performance(db: Session = Depends(get_db)):
    return [
        {
            "id": p.id,
            "name": p.name,
            "sales": p.quantity * 2,
            "revenue": p.quantity * p.price
        }
        for p in db.query(Product).all()
    ]


@app.get("/api/analytics/insights")
def business_insights(db: Session = Depends(get_db)):
    low = db.query(Product).filter(
        Product.quantity <= Product.reorder_level
    ).all()

    return [
        {
            "title": "Inventory Attention Required",
            "description": f"{len(low)} products are at or below their reorder levels.",
            "type": "warning"
        },
        {
            "title": "Revenue Performance",
            "description": "Demo revenue data indicates a positive business trend.",
            "type": "success"
        }
    ]


# --------------------------------------------------
# AI AGENTS
# --------------------------------------------------

@app.get("/api/agents/status")
def agent_status():
    agents = [
        "Business Analytics",
        "Inventory Management",
        "Anomaly Detection",
        "Workflow Planning",
        "Recommendation",
        "Action Execution",
        "Verification & Audit"
    ]

    return [
        {
            "name": name,
            "status": "Ready",
            "description": f"{name} agent is available in demo mode."
        }
        for name in agents
    ]


@app.post("/api/agents/run-analysis")
def run_agent_analysis(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    low_stock = [p for p in products if p.quantity <= p.reorder_level]

    created = 0

    for product in low_stock:
        exists = db.query(Recommendation).filter(
            Recommendation.title == f"Reorder {product.name}",
            Recommendation.status == "pending"
        ).first()

        if not exists:
            db.add(Recommendation(
                title=f"Reorder {product.name}",
                description=f"{product.name} has {product.quantity} units remaining. Its reorder level is {product.reorder_level}.",
                priority="High",
                estimated_impact="Reduce potential lost sales"
            ))
            created += 1

    db.commit()

    add_audit(
        db,
        "AI Analysis Completed",
        f"Demo analysis completed. {created} new recommendations generated."
    )

    return {
        "message": "Demo analysis completed",
        "new_recommendations": created,
        "agents_run": 7,
        "simulated": True
    }


# --------------------------------------------------
# RECOMMENDATIONS AND HUMAN APPROVAL
# --------------------------------------------------

@app.get("/api/recommendations/")
def get_recommendations(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Recommendation)

    if status:
        query = query.filter(Recommendation.status == status.lower())

    items = query.order_by(Recommendation.created_at.desc()).all()

    return [recommendation_dict(item) for item in items]


@app.post("/api/recommendations/{item_id}/approve")
def approve_recommendation(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Recommendation).filter(Recommendation.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    if item.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending recommendations can be approved")

    item.status = "approved"
    db.commit()

    add_audit(db, "Recommendation Approved", item.title, "Approved")

    return recommendation_dict(item)


@app.post("/api/recommendations/{item_id}/reject")
def reject_recommendation(item_id: int, payload: dict, db: Session = Depends(get_db)):
    item = db.query(Recommendation).filter(Recommendation.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    if item.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending recommendations can be rejected")

    item.status = "rejected"
    reason = payload.get("reason", "Rejected by human reviewer")

    db.commit()
    add_audit(db, "Recommendation Rejected", f"{item.title}: {reason}", "Rejected")

    return recommendation_dict(item)


@app.post("/api/recommendations/{item_id}/execute")
def execute_recommendation(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Recommendation).filter(Recommendation.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    if item.status != "approved":
        raise HTTPException(status_code=400, detail="Human approval is required before execution")

    # Simulated execution only. No real-world action is performed.
    item.status = "executed"
    db.commit()

    add_audit(
        db,
        "Simulated Action Executed",
        f"Demo execution completed for: {item.title}. No external action was performed.",
        "Success"
    )

    return {
        "message": "Demo action executed successfully",
        "recommendation": recommendation_dict(item),
        "simulated": True
    }


# --------------------------------------------------
# WORKFLOWS
# --------------------------------------------------

@app.get("/api/workflows/")
def get_workflows(db: Session = Depends(get_db)):
    workflows = db.query(Workflow).all()

    return [
        {
            "id": w.id,
            "name": w.name,
            "description": w.description,
            "status": w.status,
            "completed_at": w.completed_at.isoformat() if w.completed_at else None
        }
        for w in workflows
    ]


# --------------------------------------------------
# AUDIT LOG
# --------------------------------------------------

@app.get("/api/audit/")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

    return [
        {
            "id": log.id,
            "action": log.action,
            "action_type": log.action,
            "description": log.description,
            "status": log.status,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        }
        for log in logs
    ]


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

@app.get("/api/settings/")
def get_settings(db: Session = Depends(get_db)):
    key_setting = db.query(AppSetting).filter(
        AppSetting.name == "gemini_api_key"
    ).first()

    return {
        "mode": "Demo Mode",
        "ai_provider": "Gemini configured" if key_setting and key_setting.value else "Rule-based fallback",
        "database": "Local SQLite",
        "api_key_configured": bool(key_setting and key_setting.value)
    }


@app.post("/api/settings/gemini-key")
def save_gemini_key(payload: dict, db: Session = Depends(get_db)):
    key = payload.get("api_key", "").strip()

    if not key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")

    setting = db.query(AppSetting).filter(
        AppSetting.name == "gemini_api_key"
    ).first()

    if not setting:
        setting = AppSetting(name="gemini_api_key", value=key)
        db.add(setting)
    else:
        setting.value = key

    db.commit()

    add_audit(db, "AI Settings Updated", "Gemini API key configuration updated.")

    return {"message": "API key saved locally", "configured": True}


@app.post("/api/settings/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    db.query(Product).delete()
    db.query(Recommendation).delete()
    db.query(Workflow).delete()
    db.query(AuditLog).delete()

    db.commit()
    seed_demo_data(db)

    add_audit(db, "Demo Data Reset", "Local demo data was restored.", "Success")

    return {"message": "Demo data restored successfully"}


# --------------------------------------------------
# STARTUP MESSAGE
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
