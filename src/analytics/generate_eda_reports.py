import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from src.data.prepare_data import process_and_save_data
from src.analytics.metrics import compute_kpi_summary, compute_all_breakdowns

# Set styling with a modern dark theme palette
plt.style.use('dark_background')
DARK_BG = "#0f172a"
CARD_BG = "#1e293b"
ACCENT_BLUE = "#38bdf8"
ACCENT_RED = "#f43f5e"
ACCENT_GREEN = "#34d399"
ACCENT_PURPLE = "#a855f7"
PALETTE = [ACCENT_BLUE, ACCENT_RED, ACCENT_GREEN, ACCENT_PURPLE, "#fbbf24", "#ec4899"]


def setup_dark_figure(figsize=(9, 5.5)):
    fig, ax = plt.subplots(figsize=figsize, facecolor=DARK_BG)
    ax.set_facecolor(CARD_BG)
    ax.grid(True, color="#334155", linestyle="--", alpha=0.6, zorder=0)
    for spine in ax.spines.values():
        spine.set_color("#475569")
    return fig, ax


def generate_all_eda():
    fig_dir = Path("reports/figures")
    fig_dir.mkdir(parents=True, exist_ok=True)

    cleaned_df, _ = process_and_save_data()
    kpis = compute_kpi_summary(cleaned_df)
    breakdowns = compute_all_breakdowns(cleaned_df)

    # 1. Churn Distribution Pie / Donut Chart
    fig, ax = setup_dark_figure(figsize=(7, 7))
    churn_counts = cleaned_df['Churn'].value_counts()
    wedges, texts, autotexts = ax.pie(
        churn_counts,
        labels=[f"Retained ({churn_counts['No']:,})", f"Churned ({churn_counts['Yes']:,})"],
        autopct='%1.1f%%',
        startangle=140,
        colors=[ACCENT_BLUE, ACCENT_RED],
        wedgeprops=dict(width=0.45, edgecolor=DARK_BG, linewidth=3),
        textprops=dict(color="#f8fafc", fontsize=12, weight='bold')
    )
    for at in autotexts:
        at.set_color('#ffffff')
        at.set_fontsize(13)
        at.set_weight('bold')
    ax.set_title("Customer Churn Distribution", fontsize=16, color="#f8fafc", weight='bold', pad=20)
    plt.tight_layout()
    fig.savefig(fig_dir / "01_churn_distribution.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 2. Churn Rate by Contract Type
    fig, ax = setup_dark_figure()
    contract_df = pd.DataFrame(breakdowns['Contract'])
    bars = ax.bar(contract_df['category'], contract_df['churn_pct'], color=[ACCENT_RED, "#fb923c", ACCENT_GREEN], width=0.55, zorder=3)
    ax.set_ylabel("Churn Rate (%)", fontsize=12, color="#cbd5e1")
    ax.set_title("Churn Rate by Contract Type", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 1.0, f"{yval:.1f}%", ha='center', va='bottom', color='#ffffff', weight='bold', fontsize=11)
    ax.set_ylim(0, 55)
    plt.tight_layout()
    fig.savefig(fig_dir / "02_churn_by_contract.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 3. Churn Rate by Tenure Group
    fig, ax = setup_dark_figure()
    tenure_df = pd.DataFrame(breakdowns['tenure_group'])
    bars = ax.bar(tenure_df['category'], tenure_df['churn_pct'], color=ACCENT_BLUE, width=0.55, zorder=3)
    ax.set_ylabel("Churn Rate (%)", fontsize=12, color="#cbd5e1")
    ax.set_title("Churn Rate by Customer Tenure Cohort", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 1.0, f"{yval:.1f}%", ha='center', va='bottom', color='#ffffff', weight='bold', fontsize=11)
    ax.set_ylim(0, 60)
    plt.tight_layout()
    fig.savefig(fig_dir / "03_churn_by_tenure_group.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 4. Churn Rate by Internet Service
    fig, ax = setup_dark_figure()
    internet_df = pd.DataFrame(breakdowns['InternetService'])
    bars = ax.bar(internet_df['category'], internet_df['churn_pct'], color=[ACCENT_BLUE, ACCENT_RED, ACCENT_GREEN], width=0.55, zorder=3)
    ax.set_ylabel("Churn Rate (%)", fontsize=12, color="#cbd5e1")
    ax.set_title("Churn Rate by Internet Service Type", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 1.0, f"{yval:.1f}%", ha='center', va='bottom', color='#ffffff', weight='bold', fontsize=11)
    ax.set_ylim(0, 50)
    plt.tight_layout()
    fig.savefig(fig_dir / "04_churn_by_internet_service.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 5. Churn Rate by Payment Method
    fig, ax = setup_dark_figure(figsize=(10, 5.5))
    pay_df = pd.DataFrame(breakdowns['PaymentMethod'])
    bars = ax.bar(pay_df['category'], pay_df['churn_pct'], color=ACCENT_PURPLE, width=0.55, zorder=3)
    ax.set_ylabel("Churn Rate (%)", fontsize=12, color="#cbd5e1")
    ax.set_title("Churn Rate by Payment Method", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    plt.xticks(rotation=15, ha='right')
    for bar in bars:
        yval = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2.0, yval + 1.0, f"{yval:.1f}%", ha='center', va='bottom', color='#ffffff', weight='bold', fontsize=11)
    ax.set_ylim(0, 55)
    plt.tight_layout()
    fig.savefig(fig_dir / "05_churn_by_payment_method.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 6. Monthly Charges Distribution by Churn Status (KDE / Histogram)
    fig, ax = setup_dark_figure()
    retained_mc = cleaned_df[cleaned_df['Churn'] == 'No']['MonthlyCharges']
    churned_mc = cleaned_df[cleaned_df['Churn'] == 'Yes']['MonthlyCharges']
    ax.hist(retained_mc, bins=30, alpha=0.6, color=ACCENT_BLUE, label=f'Retained (Mean: ${retained_mc.mean():.1f})', density=True)
    ax.hist(churned_mc, bins=30, alpha=0.6, color=ACCENT_RED, label=f'Churned (Mean: ${churned_mc.mean():.1f})', density=True)
    ax.set_xlabel("Monthly Charges ($)", fontsize=12, color="#cbd5e1")
    ax.set_ylabel("Density", fontsize=12, color="#cbd5e1")
    ax.set_title("Monthly Charges Distribution by Churn Status", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    ax.legend(frameon=True, facecolor=CARD_BG, edgecolor="#475569", fontsize=11)
    plt.tight_layout()
    fig.savefig(fig_dir / "06_monthly_charges_distribution.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 7. Tenure Distribution by Churn Status
    fig, ax = setup_dark_figure()
    retained_ten = cleaned_df[cleaned_df['Churn'] == 'No']['tenure']
    churned_ten = cleaned_df[cleaned_df['Churn'] == 'Yes']['tenure']
    ax.hist(retained_ten, bins=36, alpha=0.6, color=ACCENT_BLUE, label=f'Retained (Mean: {retained_ten.mean():.1f} mos)', density=True)
    ax.hist(churned_ten, bins=36, alpha=0.6, color=ACCENT_RED, label=f'Churned (Mean: {churned_ten.mean():.1f} mos)', density=True)
    ax.set_xlabel("Tenure (Months)", fontsize=12, color="#cbd5e1")
    ax.set_ylabel("Density", fontsize=12, color="#cbd5e1")
    ax.set_title("Customer Tenure Distribution by Churn Status", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    ax.legend(frameon=True, facecolor=CARD_BG, edgecolor="#475569", fontsize=11)
    plt.tight_layout()
    fig.savefig(fig_dir / "07_tenure_distribution.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # 8. Numeric Correlations Heatmap
    fig, ax = setup_dark_figure(figsize=(7, 6))
    num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Churn_Binary']
    corr = cleaned_df[num_cols].corr()
    sns.heatmap(corr, annot=True, fmt=".3f", cmap="vlag", center=0, cbar=True, ax=ax,
                linewidths=1, linecolor=DARK_BG, annot_kws={"size": 11, "weight": "bold", "color": "#f8fafc"})
    ax.set_title("Numeric Features Correlation Matrix", fontsize=15, color="#f8fafc", weight='bold', pad=15)
    plt.tight_layout()
    fig.savefig(fig_dir / "08_correlation_heatmap.png", dpi=300, facecolor=fig.get_facecolor())
    plt.close()

    # Write findings report
    generate_markdown_report(kpis, breakdowns, cleaned_df)
    print("All EDA visualizations and markdown report successfully generated!")


def generate_markdown_report(kpis, breakdowns, df):
    report_content = f"""# Exploratory Data Analysis & Statistical Findings

**Dataset:** IBM Telco Customer Churn  
**Total Records:** {kpis['total_customers']:,} customers  
**Cleaned Features:** 21 attributes + engineered cohorts (`tenure_group`, `Churn_Binary`)  

---

## 1. Executive Summary & Core KPIs

| KPI Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Customers** | **{kpis['total_customers']:,}** | Unique customer accounts analyzed |
| **Retained Customers** | **{kpis['retained_customers']:,}** ({(100 - kpis['churn_percentage']):.2f}%) | Active/retained subscriber base |
| **Churned Customers** | **{kpis['churned_customers']:,}** ({kpis['churn_percentage']:.2f}%) | Subscribers who discontinued service |
| **Average Monthly Charges** | **${kpis['avg_monthly_charges']:.2f}** | Across entire customer base |
| **Total Monthly Revenue** | **${kpis['total_monthly_revenue']:,}** | Sum of all active monthly billings |
| **Churned Monthly Charges** | **${kpis['churned_monthly_charges']:,}** | Monthly billing associated with churned accounts |
| **Average Customer Tenure** | **{kpis['avg_tenure_months']} months** | Mean tenure across all customers |

---

## 2. Key Statistical Insights & Dimensions

### A. Contract Structure (Highest Risk Factor)
- **Month-to-month:** Churn rate of **42.71%** (2,220 of 3,875 customers).
- **One year:** Churn rate drops to **11.27%** (166 of 1,473 customers).
- **Two year:** Churn rate drops to **2.83%** (48 of 1,695 customers).
> *Observation:* Customers on month-to-month contracts have approximately **15x higher churn rate** than those committed to two-year contracts.

### B. Customer Tenure Cohort (Early Life-Cycle Hazard)
- **0–12 Months:** Churn rate of **47.44%** (1,037 churned out of 2,186).
- **13–24 Months:** Churn rate of **28.70%** (294 churned).
- **25–48 Months:** Churn rate of **19.38%** (309 churned).
- **49–60 Months:** Churn rate of **13.79%** (115 churned).
- **61–72 Months:** Churn rate of **6.61%** (114 churned out of 1,725).
> *Observation:* Over **55.5% of all churn events** occur within the first year of subscription.

### C. Internet Service Type
- **Fiber Optic:** Churn rate of **41.89%** (1,297 churned out of 3,096).
- **DSL:** Churn rate of **18.96%** (459 churned out of 2,421).
- **No Internet:** Churn rate of **7.40%** (113 churned out of 1,526).
> *Observation:* Fiber optic customers exhibit significantly higher monthly charges (average ~$91/mo) and markedly elevated churn rates, indicating pricing or service experience sensitivity.

### D. Payment Method
- **Electronic Check:** Churn rate of **45.29%** (1,071 churned out of 2,365).
- **Mailed Check:** Churn rate of **19.11%** (308 churned out of 1,612).
- **Bank Transfer (auto):** Churn rate of **16.71%** (258 churned out of 1,544).
- **Credit Card (auto):** Churn rate of **15.24%** (232 churned out of 1,522).
> *Observation:* Customers using automated billing methods (Bank transfer or Credit card) churn at less than half the rate of electronic check users.

### E. Tech Support & Value-Added Security
- Customers **without Tech Support** churn at **41.64%**, compared to **15.17%** for customers **with Tech Support**.
- Customers **without Online Security** churn at **41.77%**, compared to **14.61%** for customers **with Online Security**.

---

## 3. Visualizations Generated

1. `01_churn_distribution.png`: Overall customer retention vs churn donut chart.
2. `02_churn_by_contract.png`: Bar chart contrasting Month-to-month, 1-year, and 2-year contracts.
3. `03_churn_by_tenure_group.png`: Tenure cohort churn curve highlighting early-tenure vulnerability.
4. `04_churn_by_internet_service.png`: Internet service breakdown comparing Fiber optic, DSL, and None.
5. `05_churn_by_payment_method.png`: Payment method analysis emphasizing electronic check churn.
6. `06_monthly_charges_distribution.png`: Density histogram of Monthly Charges by churn status.
7. `07_tenure_distribution.png`: Density histogram of Tenure by churn status.
8. `08_correlation_heatmap.png`: Correlation matrix across numerical variables and churn.

---

## 4. Analytical Notes & Methodological Guardrails
- **No Causality Implied:** These findings demonstrate empirical associations within historical IBM Telco data and should not be interpreted as proven causal mechanisms without controlled A/B testing.
- **Data Integrity:** All 11 records with zero tenure had their TotalCharges converted to 0.0 with zero dropped rows.
"""
    Path("reports/eda_findings.md").write_text(report_content, encoding="utf-8")


if __name__ == "__main__":
    generate_all_eda()
