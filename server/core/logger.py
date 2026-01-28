import logging
import sys
from core.config import settings

# Create logger
logger = logging.getLogger("subscription_manager")
logger.setLevel(getattr(logging, settings.LOG_LEVEL))

# Create console handler
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(getattr(logging, settings.LOG_LEVEL))

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)

# Add handler to logger
logger.addHandler(handler)