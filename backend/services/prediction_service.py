"""
Prediction service wrapper for loading model and executing inference.
"""
import sys
from pathlib import Path
from typing import Dict, Any, List

# Ensure project root in sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.models.predict import ChurnPredictor


class PredictionService:
    _instance: "PredictionService" = None

    def __init__(self):
        model_file = PROJECT_ROOT / "artifacts" / "churn_pipeline.joblib"
        meta_file = PROJECT_ROOT / "artifacts" / "model_metadata.json"
        self.predictor = ChurnPredictor(
            model_path=str(model_file),
            metadata_path=str(meta_file)
        )

    @classmethod
    def get_instance(cls) -> "PredictionService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def predict_one(self, data: Dict[str, Any]) -> Dict[str, Any]:
        return self.predictor.predict_single(data)

    def predict_many(self, data_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return self.predictor.predict_batch(data_list)

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "model_name": self.predictor.metadata.get("model_name", "XGBoost"),
            "model_version": self.predictor.model_version,
            "decision_threshold": self.predictor.threshold,
            "metrics": self.predictor.metadata.get("metrics", {}),
            "features": self.predictor.metadata.get("features", {}),
            "all_model_comparison": self.predictor.metadata.get("all_model_comparison", {})
        }
