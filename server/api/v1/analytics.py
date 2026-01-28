from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from services.db.subscriptions import get_user_subscriptions
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/summary")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])

    subscriptions = await get_user_subscriptions(user_id)
    total_monthly = 0

    for sub in subscriptions:
        if sub.status == "active":
            if sub.billing_cycle == "monthly":
                total_monthly += sub.cost
            elif sub.billing_cycle == "annual":
                total_monthly += sub.cost / 12

    total_annual = total_monthly * 12
    active_count = len([sub for sub in subscriptions if sub.status == "active"])

    today = datetime.now().date()
    thirty_days = today + timedelta(days=30)
    upcoming = []

    for sub in subscriptions:
        if sub.status == "active" and today <= sub.renewal_date <= thirty_days:
            upcoming.append({
                "platform": sub.platform,
                "name": sub.name,
                "renewal_date": sub.renewal_date,
                "cost": sub.cost
            })
    
    return {
        "total_monthly": round(total_monthly, 2),
        "total_annual": round(total_annual, 2),
        "active_count": active_count,
        "upcoming_renewals": upcoming
    }
