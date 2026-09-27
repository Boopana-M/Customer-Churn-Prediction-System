"""
Analytics and dataset service layer for serving KPIs, dimension breakdowns, and customer views.
"""
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.analytics.metrics import compute_kpi_summary, compute_dimension_breakdown, compute_all_breakdowns


class AnalyticsService:
    _instance: "AnalyticsService" = None

    def __init__(self):
        clean_file = PROJECT_ROOT / "dataset" / "processed" / "customers_clean.csv"
        if not clean_file.exists():
            # Fallback to prepare
            from src.data.prepare_data import process_and_save_data
            self.df, _ = process_and_save_data()
        else:
            self.df = pd.read_csv(clean_file)

    @classmethod
    def get_instance(cls) -> "AnalyticsService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_kpis(self) -> Dict[str, Any]:
        return compute_kpi_summary(self.df)

    def get_dimension_breakdown(self, dimension: str) -> List[Dict[str, Any]]:
        return compute_dimension_breakdown(self.df, dimension)

    def get_all_breakdowns(self) -> Dict[str, List[Dict[str, Any]]]:
        return compute_all_breakdowns(self.df)

    def get_segments(self) -> List[Dict[str, Any]]:
        metrics_file = PROJECT_ROOT / "dataset" / "processed" / "dashboard_metrics.csv"
        if metrics_file.exists():
            m_df = pd.read_csv(metrics_file)
            return m_df.to_dict(orient="records")
        return []

    def get_customers(
        self,
        page: int = 1,
        page_size: int = 25,
        search: Optional[str] = None,
        contract: Optional[str] = None,
        internet_service: Optional[str] = None,
        churn_status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Returns paginated and filtered customer records.
        """
        filtered = self.df.copy()

        if search:
            s = search.strip().lower()
            filtered = filtered[filtered['customerID'].str.lower().str.contains(s, na=False)]

        if contract and contract != "All":
            filtered = filtered[filtered['Contract'] == contract]

        if internet_service and internet_service != "All":
            filtered = filtered[filtered['InternetService'] == internet_service]

        if churn_status and churn_status != "All":
            filtered = filtered[filtered['Churn'] == churn_status]

        total_matching = len(filtered)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        page_records = filtered.iloc[start_idx:end_idx].to_dict(orient="records")

        return {
            "total_count": total_matching,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total_matching + page_size - 1) // page_size),
            "customers": page_records
        }
