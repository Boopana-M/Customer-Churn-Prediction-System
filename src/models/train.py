"""
Model training and experimentation pipeline for Customer Churn Prediction.
Compares Logistic Regression, Decision Tree, Random Forest, and XGBoost.
Serializes best pipeline and records comprehensive model metadata.
"""
import sys
import json
import datetime
from pathlib import Path
from typing import Dict, Any

# Ensure project root in sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

from src.features.preprocessing import build_preprocessor, ALL_MODEL_FEATURES, get_feature_names
from src.models.evaluate import evaluate_model

RANDOM_SEED = 42


def train_and_compare_models(
    data_path: str = "dataset/processed/customers_clean.csv",
    artifacts_dir: str = "artifacts",
    reports_dir: str = "reports"
) -> Dict[str, Any]:
    """
    Executes end-to-end model training, comparison, serialization, and reporting.
    """
    art_path = Path(artifacts_dir)
    art_path.mkdir(parents=True, exist_ok=True)
    rep_path = Path(reports_dir)
    rep_path.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(data_path)
    X = df[ALL_MODEL_FEATURES]
    y = df['Churn_Binary']

    # Stratified Train-Test Split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=y
    )

    print(f"Dataset split: Train={len(X_train)} samples, Test={len(X_test)} samples (Stratified Churn={y_test.mean():.4f})")

    # Define model candidates
    candidates = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=RANDOM_SEED
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=5,
            class_weight="balanced",
            random_state=RANDOM_SEED
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=150,
            max_depth=8,
            min_samples_split=10,
            class_weight="balanced",
            random_state=RANDOM_SEED,
            n_jobs=-1
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.08,
            scale_pos_weight=(len(y_train) - y_train.sum()) / y_train.sum(),
            eval_metric="logloss",
            random_state=RANDOM_SEED,
            n_jobs=-1
        )
    }

    results = {}
    pipelines = {}

    for name, estimator in candidates.items():
        print(f"Training {name}...")
        preprocessor = build_preprocessor()
        pipe = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("classifier", estimator)
        ])
        pipe.fit(X_train, y_train)
        eval_metrics = evaluate_model(pipe, X_test, y_test)
        results[name] = eval_metrics
        pipelines[name] = pipe
        print(f"  {name} -> ROC-AUC: {eval_metrics['roc_auc']:.4f}, Recall: {eval_metrics['recall']:.4f}, Precision: {eval_metrics['precision']:.4f}, F1: {eval_metrics['f1_score']:.4f}")

    # Select best model based on ROC-AUC & balanced F1 score
    # Random Forest / XGBoost typically excel; let's select best ROC-AUC
    best_model_name = max(results.keys(), key=lambda m: (results[m]['roc_auc'], results[m]['f1_score']))
    best_pipeline = pipelines[best_model_name]
    best_metrics = results[best_model_name]

    print(f"\nBest Performing Model: {best_model_name} (ROC-AUC: {best_metrics['roc_auc']:.4f})")

    # Save Pipeline
    model_save_path = art_path / "churn_pipeline.joblib"
    joblib.dump(best_pipeline, model_save_path)
    print(f"Pipeline saved to: {model_save_path.resolve()}")

    # Compute Feature Importances
    feature_names = get_feature_names(best_pipeline.named_steps["preprocessor"])
    classifier = best_pipeline.named_steps["classifier"]

    importances = {}
    if hasattr(classifier, "feature_importances_"):
        raw_imp = classifier.feature_importances_
        importances = {feat: round(float(imp), 4) for feat, imp in sorted(zip(feature_names, raw_imp), key=lambda x: x[1], reverse=True)}
    elif hasattr(classifier, "coef_"):
        raw_imp = np.abs(classifier.coef_[0])
        importances = {feat: round(float(imp), 4) for feat, imp in sorted(zip(feature_names, raw_imp), key=lambda x: x[1], reverse=True)}

    # Top 10 Features
    top_10_features = dict(list(importances.items())[:10])

    # Save Model Metadata
    metadata = {
        "model_name": best_model_name,
        "model_version": "1.0.0",
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        "dataset_source": "IBM Telco Customer Churn",
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "random_seed": RANDOM_SEED,
        "features": {
            "all_features": ALL_MODEL_FEATURES,
            "encoded_feature_count": len(feature_names),
            "top_10_features": top_10_features
        },
        "metrics": best_metrics,
        "all_model_comparison": results,
        "decision_threshold": 0.50,
        "risk_thresholds": {
            "Low Risk": [0.0, 0.30],
            "Moderate Risk": [0.30, 0.60],
            "High Risk": [0.60, 1.00]
        }
    }

    metadata_path = art_path / "model_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata saved to: {metadata_path.resolve()}")

    # Generate Model Evaluation Markdown Report
    generate_model_report(results, best_model_name, top_10_features, metadata, rep_path / "model_evaluation.md")

    return metadata


def generate_model_report(results: Dict[str, Any], best_name: str, top_features: Dict[str, float], metadata: Dict[str, Any], output_path: Path):
    """Writes reports/model_evaluation.md with model benchmark comparisons."""
    rows = []
    for model_name, metrics in results.items():
        cm = metrics['confusion_matrix']
        rows.append(
            f"| **{model_name}** | {metrics['accuracy']:.4f} | {metrics['precision']:.4f} | {metrics['recall']:.4f} | {metrics['f1_score']:.4f} | **{metrics['roc_auc']:.4f}** | {metrics['pr_auc']:.4f} | TP={cm['true_positives']}, FP={cm['false_positives']}, FN={cm['false_negatives']}, TN={cm['true_negatives']} |"
        )
    table_str = "\n".join(rows)

    feat_rows = []
    for feat, score in top_features.items():
        feat_rows.append(f"| `{feat}` | {score:.4f} |")
    feat_str = "\n".join(feat_rows)

    content = f"""# Machine Learning Model Evaluation & Benchmarks

**Dataset:** IBM Telco Customer Churn (7,043 records)  
**Train / Test Split:** 80% Train ({metadata['train_samples']:,} samples) / 20% Test ({metadata['test_samples']:,} samples, Stratified)  
**Selected Champion Model:** **{best_name}** (v{metadata['model_version']})  

---

## 1. Candidate Model Comparison Benchmark

| Model Candidate | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Confusion Matrix (Test Set) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
{table_str}

---

## 2. Champion Model In-Depth Analysis: `{best_name}`

- **ROC-AUC Score:** **{results[best_name]['roc_auc']:.4f}** — Demonstrates strong discriminative capability across varied classification thresholds.
- **Recall on Churn Class:** **{results[best_name]['recall']:.4f}** — Successfully catches the majority of customers at risk of churn.
- **Precision:** **{results[best_name]['precision']:.4f}**
- **F1-Score:** **{results[best_name]['f1_score']:.4f}**

### Confusion Matrix Breakdown (Test Set: {metadata['test_samples']:,} instances)
- **True Positives (Correctly identified churn):** {results[best_name]['confusion_matrix']['true_positives']}
- **False Positives (Retained customers flagged as churn):** {results[best_name]['confusion_matrix']['false_positives']}
- **False Negatives (Churned customers missed):** {results[best_name]['confusion_matrix']['false_negatives']}
- **True Negatives (Correctly identified retained):** {results[best_name]['confusion_matrix']['true_negatives']}

---

## 3. Global Feature Importance (Top 10 Influential Features)

| Feature / One-Hot Encoding | Relative Importance |
| :--- | :--- |
{feat_str}

> *Note on Interpretability:* Feature importance reflects the mathematical weight allocated by the tree ensemble. It indicates statistical predictive value within the dataset and does not establish independent real-world causality.

---

## 4. Risk Stratification Policy

For business actionability, predicted probabilities are mapped to three operational risk tiers:
- **Low Risk (0.00 – 0.30):** Routine standard engagement.
- **Moderate Risk (0.30 – 0.60):** Proactive engagement, loyalty incentives, service satisfaction check.
- **High Risk (0.60 – 1.00):** Priority retention outreach, customized renewal incentives.
"""
    output_path.write_text(content, encoding="utf-8")
    print(f"Model evaluation report written to: {output_path.resolve()}")


if __name__ == "__main__":
    train_and_compare_models()
