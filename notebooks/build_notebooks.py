"""
Script to create the Jupyter Notebooks:
- notebooks/01_data_inspection_and_cleaning.ipynb
- notebooks/02_exploratory_data_analysis.ipynb
"""
import json
from pathlib import Path


def create_notebook(cells, output_path):
    nb = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.10.11"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 5
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2)
    print(f"Created notebook: {output_path}")


def make_code_cell(source):
    if isinstance(source, str):
        source = [line + "\n" for line in source.split("\n")]
        # remove trailing newline on last line
        if source:
            source[-1] = source[-1].rstrip("\n")
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source
    }


def make_md_cell(source):
    if isinstance(source, str):
        source = [line + "\n" for line in source.split("\n")]
        if source:
            source[-1] = source[-1].rstrip("\n")
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source
    }


def build_all_notebooks():
    nb_dir = Path("notebooks")
    nb_dir.mkdir(parents=True, exist_ok=True)

    # Notebook 1: Data Inspection and Cleaning
    cells_01 = [
        make_md_cell("# 01 - Data Inspection and Cleaning\n\n**Project:** Customer Churn Intelligence Platform\n**Dataset:** IBM Telco Customer Churn\n\nThis notebook inspects the raw dataset, analyzes missing values and whitespace strings, formats types safely, and saves the cleaned dataset for ML and BI."),
        make_code_cell("import sys\nimport os\nfrom pathlib import Path\nimport pandas as pd\nimport numpy as np\n\n# Add project root to sys.path\nproject_root = Path.cwd().parent if Path.cwd().name == 'notebooks' else Path.cwd()\nsys.path.append(str(project_root))\n\nfrom src.data.prepare_data import load_raw_data, clean_churn_data, process_and_save_data"),
        make_md_cell("## 1. Load Raw Dataset"),
        make_code_cell("raw_df = load_raw_data(str(project_root / 'dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv'))\nprint(f'Shape: {raw_df.shape[0]} rows, {raw_df.shape[1]} columns')\nraw_df.head()"),
        make_md_cell("## 2. Dataset Schema & Column Inspection"),
        make_code_cell("raw_df.info()"),
        make_md_cell("## 3. Examine Whitespace & Missing Values in `TotalCharges`"),
        make_code_cell("whitespace_mask = raw_df['TotalCharges'].astype(str).str.strip() == ''\nprint(f'Whitespace TotalCharges count: {whitespace_mask.sum()}')\nraw_df[whitespace_mask][['customerID', 'tenure', 'MonthlyCharges', 'TotalCharges', 'Churn']]"),
        make_md_cell("## 4. Execute Data Cleaning Pipeline\n\n- Convert `TotalCharges` to numeric, setting zero-tenure whitespace records to `0.0`.\n- Create tenure cohorts (`tenure_group`).\n- Generate binary integer churn target (`Churn_Binary`)."),
        make_code_cell("clean_df, dashboard_df = process_and_save_data(\n    raw_path=str(project_root / 'dataset/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv'),\n    output_dir=str(project_root / 'dataset/processed')\n)\nclean_df.head()"),
        make_md_cell("## 5. Summary Statistics of Cleaned Dataset"),
        make_code_cell("clean_df[['tenure', 'MonthlyCharges', 'TotalCharges']].describe()")
    ]
    create_notebook(cells_01, nb_dir / "01_data_inspection_and_cleaning.ipynb")

    # Notebook 2: Exploratory Data Analysis
    cells_02 = [
        make_md_cell("# 02 - Exploratory Data Analysis (EDA)\n\n**Project:** Customer Churn Intelligence Platform\n**Dataset:** IBM Telco Customer Churn\n\nThis notebook visualizes churn distributions, customer cohorts, service usage patterns, and revenue metrics."),
        make_code_cell("import sys\nfrom pathlib import Path\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\nimport numpy as np\n\nproject_root = Path.cwd().parent if Path.cwd().name == 'notebooks' else Path.cwd()\nsys.path.append(str(project_root))\n\nfrom src.analytics.metrics import compute_kpi_summary, compute_all_breakdowns\nfrom src.analytics.generate_eda_reports import generate_all_eda\n\nclean_df = pd.read_csv(project_root / 'dataset/processed/customers_clean.csv')\nprint(f'Loaded cleaned data: {clean_df.shape}')"),
        make_md_cell("## 1. High-Level Dataset KPIs"),
        make_code_cell("kpis = compute_kpi_summary(clean_df)\nfor k, v in kpis.items():\n    print(f'{k:25s}: {v}')"),
        make_md_cell("## 2. Categorical Dimension Breakdowns"),
        make_code_cell("breakdowns = compute_all_breakdowns(clean_df)\npd.DataFrame(breakdowns['Contract'])"),
        make_code_cell("pd.DataFrame(breakdowns['InternetService'])"),
        make_code_cell("pd.DataFrame(breakdowns['PaymentMethod'])"),
        make_md_cell("## 3. Generate & Save All Publication-Ready EDA Figures"),
        make_code_cell("generate_all_eda()")
    ]
    create_notebook(cells_02, nb_dir / "02_exploratory_data_analysis.ipynb")


if __name__ == "__main__":
    build_all_notebooks()
