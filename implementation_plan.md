# Customer Churn Intelligence Platform --- Implementation Plan

## 1. Project Overview

**Project title:** Customer Churn Intelligence Platform\
**Type:** Data Science + Machine Learning + Full-Stack Web Application +
Business Intelligence\
**Primary dataset:** IBM Telco Customer Churn\
**Dataset source:**
https://www.kaggle.com/datasets/blastchar/telco-customer-churn

### Objective

Build an end-to-end customer churn analytics platform that:

1.  Explores and analyzes customer churn using data science techniques.
2.  Trains and evaluates machine learning models to predict churn.
3.  Explains predictions and identifies important churn factors.
4.  Provides a web application for customer-level churn prediction and
    analytics.
5.  Provides separate Tableau and Power BI dashboards using the same
    processed data.

The project is an educational and analytical prototype. It must not
claim to predict actual churn at Netflix, Disney+, Peloton, or any other
company. The IBM Telco dataset is a separate, publicly available
dataset.

## 2. Problem Statement

Subscription-based businesses can lose recurring revenue when customers
discontinue their services. Historical customer data can be analyzed to
identify patterns associated with churn and build models that estimate
which customers are more likely to leave.

The platform should answer:

-   What proportion of customers churned in the dataset?
-   Which customer characteristics and services are associated with
    churn?
-   How does churn vary by tenure, contract type, payment method, and
    monthly charges?
-   How accurately can machine learning models identify customers who
    churn?
-   Which factors contribute to an individual prediction?
-   How can business users explore churn and revenue-related metrics?

Do not claim that model predictions cause retention or that a model
reduces churn unless this is demonstrated through a properly designed
intervention study.

## 3. Dataset

### Initial dataset

Use the IBM Telco Customer Churn CSV available from Kaggle.

-   Expected rows: 7,043
-   Expected columns: 21
-   Target column: `Churn`
-   Identifier: `customerID`

The agent must verify the downloaded file, actual dimensions, column
names, data types, and target distribution rather than assuming these
values.

### Dataset handling

Create these directories:

``` text
dataset/
├── raw/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv
└── processed/
    ├── customers_clean.csv
    └── dashboard_metrics.csv
```

Requirements:

-   Keep the original raw dataset unchanged.
-   Do not commit large datasets or sensitive data unnecessarily.
-   Document the source, license/usage terms, and download date.
-   Treat `customerID` as an identifier, not a predictive feature.
-   Investigate blank or whitespace-only values in `TotalCharges`.
-   Convert `TotalCharges` to numeric safely.
-   Check duplicates, missing values, invalid values, and unexpected
    categories.
-   Do not silently drop records; document any exclusions and their
    reasons.
-   Use a consistent target convention: `Churn = Yes` means churned.

## 4. Recommended Technology Stack

  Layer                 Technology
  --------------------- ----------------------------------------------------
  Programming           Python
  Data manipulation     Pandas, NumPy
  Visualization / EDA   Matplotlib, Seaborn
  Machine learning      Scikit-learn, XGBoost (optional)
  Model explanation     SHAP (optional; use only if compatible)
  Experimentation       Google Colab / Jupyter
  Model serialization   Joblib
  Backend API           FastAPI, Pydantic
  Frontend              React, TypeScript, Tailwind CSS
  Frontend charts       Recharts
  API communication     REST, JSON
  BI dashboards         Tableau Public / Tableau Desktop, Power BI Desktop
  Version control       Git and GitHub
  Testing               Pytest, React testing tools where appropriate

Prefer React + FastAPI so the Python model can be loaded directly by the
backend. Do not add Spring Boot unless explicitly requested; it would
introduce a second backend without being necessary for this project.

## 5. Repository Structure

Create and maintain the following structure:

``` text
customer-churn-intelligence/
├── README.md
├── .gitignore
├── requirements.txt
├── dataset/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_data_inspection_and_cleaning.ipynb
│   ├── 02_exploratory_data_analysis.ipynb
│   └── 03_model_training_and_evaluation.ipynb
├── src/
│   ├── data/
│   │   └── prepare_data.py
│   ├── features/
│   │   └── preprocessing.py
│   ├── models/
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── predict.py
│   └── analytics/
│       └── metrics.py
├── artifacts/
│   ├── churn_pipeline.joblib
│   └── model_metadata.json
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── services/
│   │   ├── prediction_service.py
│   │   └── analytics_service.py
│   └── tests/
│       ├── test_health.py
│       ├── test_prediction.py
│       └── test_analytics.py
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
├── dashboards/
│   ├── tableau/
│   └── powerbi/
└── reports/
    ├── eda_findings.md
    └── model_evaluation.md
```

The agent may adjust implementation details if necessary, but should
preserve clear separation between data, modeling, API, frontend, and BI
assets.

## 6. Phase-by-Phase Implementation

### Phase 1 --- Dataset acquisition and project setup

Tasks:

1.  Create the repository and directory structure.
2.  Download the dataset from the specified source, or ask the user to
    upload it if the environment cannot access Kaggle.
3.  Place the original CSV in `dataset/raw/`.
4.  Create a Python environment and install dependencies.
5.  Add a `.gitignore` for virtual environments, caches, secrets, and
    generated files as appropriate.
6.  Verify the dataset is readable and document its schema.

Acceptance criteria:

-   Raw CSV is present and readable.
-   Dataset dimensions and column names are recorded.
-   Project dependencies are documented.
-   The raw file remains unmodified.

### Phase 2 --- Data cleaning and exploratory data analysis

Implement in Colab first, then move reusable code into `src/`.

#### Data inspection

-   Display sample records, shape, columns, and data types.
-   Summarize numeric and categorical variables.
-   Check missing values, duplicates, and cardinality.
-   Inspect target class balance.
-   Identify suspicious values and potential data leakage.

#### Cleaning

-   Convert `TotalCharges` to numeric, handling blank strings.
-   Inspect records affected by conversion.
-   Decide how to handle missing values based on evidence and document
    the decision.
-   Verify valid ranges for `tenure`, `MonthlyCharges`, and
    `TotalCharges`.
-   Ensure the target contains only expected values.
-   Preserve the identifier separately from model features.

#### EDA questions and charts

Create visualizations for:

-   Churn distribution (count and percentage).
-   Churn by contract type.
-   Churn by tenure or tenure bands.
-   Churn by internet service.
-   Churn by payment method.
-   Churn by paperless billing.
-   Monthly charges by churn status.
-   Tenure distributions by churn status.
-   Relevant numeric feature relationships.

Use readable titles, axis labels, legends, and percentages where useful.
Avoid misleading chart scales.

#### Statistical interpretation

-   Describe observed associations without claiming causation.
-   Include denominators and sample sizes where useful.
-   Call out class imbalance and limitations.
-   Summarize key findings in `reports/eda_findings.md`.

Acceptance criteria:

-   Notebook runs from top to bottom.
-   Cleaning decisions are explained.
-   Charts are generated successfully.
-   EDA conclusions are supported by calculated results.

### Phase 3 --- Feature engineering and machine learning

#### Target and split

-   Predict `Churn`.
-   Exclude `customerID` from model features.
-   Use a stratified train/test split.
-   Set and document a random seed for reproducibility.
-   Keep the test set untouched until final evaluation.
-   Perform preprocessing and feature selection inside a pipeline to
    avoid data leakage.

#### Preprocessing

-   Separate numeric and categorical features.
-   Impute missing values using training data only.
-   Scale numeric features where required (e.g., Logistic Regression).
-   One-hot encode categorical features with safe handling of unseen
    categories.
-   Use a Scikit-learn `ColumnTransformer` and `Pipeline` where
    practical.

#### Models to compare

At minimum:

1.  Logistic Regression --- baseline.
2.  Decision Tree --- interpretable comparison.
3.  Random Forest --- ensemble model.
4.  XGBoost --- optional additional model, if installation and runtime
    permit.

Use the same split and evaluation process for fair comparison. Handle
class imbalance thoughtfully; consider class weights or training-only
resampling if justified. Never resample the test set.

#### Evaluation

Report:

-   Accuracy
-   Precision
-   Recall
-   F1-score
-   ROC-AUC
-   Confusion matrix
-   Precision-recall curve or average precision

Explain false positives and false negatives in the context of churn. Do
not select a model based only on accuracy. Discuss the precision/recall
trade-off and, where probabilities are used, consider calibration and
threshold selection on validation data.

#### Explainability

-   Show global feature importance using a suitable method.
-   If using SHAP, explain the scope and limitations of the
    explanations.
-   For individual predictions, show contributing features where
    technically supported.
-   Do not describe feature importance as proof of causality.

#### Model artifact

Save the complete preprocessing + estimator pipeline as:

`artifacts/churn_pipeline.joblib`

Also save `artifacts/model_metadata.json` containing:

-   Model name and version
-   Training date
-   Feature names and expected input schema
-   Target definition
-   Train/test split details
-   Evaluation metrics
-   Selected decision threshold, if tuned
-   Dataset source

Acceptance criteria:

-   All models train without errors.
-   Metrics are calculated on held-out test data.
-   The final model and preprocessing are saved together.
-   A saved model can be reloaded and used for a sample prediction.
-   Results are documented in `reports/model_evaluation.md`.

### Phase 4 --- FastAPI backend

Build a REST API that loads the saved model pipeline once at application
startup.

#### Required endpoints

  ----------------------------------------------------------------------------------
  Method                  Endpoint                           Purpose
  ----------------------- ---------------------------------- -----------------------
  GET                     `/health`                          Health check and
                                                             model-loaded status

  GET                     `/api/analytics/summary`           Overall dataset KPIs

  GET                     `/api/analytics/churn-breakdown`   Churn breakdowns by
                                                             selected dimensions

  GET                     `/api/analytics/segments`          Aggregated customer
                                                             segment metrics

  POST                    `/api/predict`                     Predict churn
                                                             probability for one
                                                             customer

  POST                    `/api/predict/batch`               Optional batch
                                                             predictions
  ----------------------------------------------------------------------------------

#### Prediction input

Create a validated Pydantic schema based on the dataset's model
features. Include relevant fields such as:

-   Gender
-   Senior citizen indicator
-   Partner and dependents
-   Tenure
-   Phone service and multiple lines
-   Internet service
-   Online security and other optional services
-   Contract
-   Paperless billing
-   Payment method
-   Monthly charges
-   Total charges

Use exact valid categories from the dataset and reject malformed inputs
with helpful validation errors.

#### Prediction response

Return a structured response containing:

-   Predicted class
-   Churn probability
-   Risk band, only if a documented threshold policy is implemented
-   Model version
-   Brief explanation or feature contributions, if available

A probability is a model estimate, not a certainty. If risk bands are
used, document the thresholds and do not imply that they are universal
business standards.

#### Backend requirements

-   Add CORS configuration for the frontend's development and production
    origins.
-   Handle missing model files and invalid inputs gracefully.
-   Avoid retraining the model inside API requests.
-   Do not expose filesystem paths, secrets, or stack traces in
    user-facing errors.
-   Add API tests for valid input, invalid input, health, and analytics.
-   Provide an OpenAPI/Swagger interface through FastAPI.

Acceptance criteria:

-   API starts successfully.
-   Health endpoint reports the model status.
-   Valid customer input returns a prediction.
-   Invalid input returns an appropriate 4xx response.
-   Tests pass locally.

### Phase 5 --- React website

Build a responsive, accessible application with a consistent visual
design.

#### Pages

1.  **Overview dashboard**
    -   Total customers
    -   Churned and retained counts
    -   Overall churn percentage
    -   Churn breakdown charts
    -   Filters for contract, tenure, and services where supported
2.  **Customer analysis**
    -   Filterable customer table
    -   Search by customer ID (if the ID is included in the displayed
        source data)
    -   Customer characteristics and churn status
    -   Clear distinction between historical labels and model
        predictions
3.  **Churn prediction**
    -   Form for entering a customer's feature values
    -   Client-side validation
    -   Prediction probability and predicted class
    -   Clear note that predictions are estimates
    -   Explanation of influential factors if supported
4.  **Model performance**
    -   Model comparison table
    -   Confusion matrix
    -   Precision, recall, F1, ROC-AUC and average precision
    -   Model version and test-set details
5.  **About**
    -   Problem statement
    -   Dataset source and limitations
    -   Modeling workflow
    -   Technology stack

#### Frontend requirements

-   Use React with TypeScript.
-   Use Tailwind CSS for styling.
-   Use Recharts for charts.
-   Create reusable components for cards, charts, tables, forms, and
    loading/error states.
-   Keep API calls in a dedicated service layer.
-   Include loading, empty, and error states.
-   Ensure responsive behavior on desktop and mobile.
-   Add clear labels, keyboard navigation, and accessible contrast.

Acceptance criteria:

-   All pages render without runtime errors.
-   Prediction form communicates with the backend.
-   Dashboard values are sourced from the API or the same documented
    dataset.
-   Charts and tables respond correctly to filters.
-   The site works at common desktop and mobile widths.

### Phase 6 --- Tableau dashboard

Use the same cleaned dataset as the web application and Power BI. Do not
independently alter the target or apply undocumented filtering.

Create a Tableau workbook with three dashboards:

#### Dashboard 1: Customer overview

-   Total customers
-   Churned customers
-   Retained customers
-   Churn rate
-   Churn distribution

#### Dashboard 2: Churn drivers and segments

-   Churn by contract type
-   Churn by tenure band
-   Churn by internet service
-   Churn by payment method
-   Churn by paperless billing

#### Dashboard 3: Revenue analysis

-   Monthly charges by churn status
-   Customer counts by charge band
-   Estimated monthly charges associated with churned customers
-   Segment-level charge comparisons

Requirements:

-   Add interactive filters and dashboard actions where useful.
-   Use clear titles and explanatory captions.
-   Define each KPI and its denominator.
-   Label revenue-related figures carefully. Monthly charges associated
    with churned customers are not necessarily realized revenue losses.
-   Save the workbook in `dashboards/tableau/`.
-   If publishing to Tableau Public, ensure the dataset contains no
    private or sensitive information and document the public link.

Acceptance criteria:

-   Workbook opens successfully.
-   All worksheets use consistent filters and definitions.
-   KPI totals reconcile with the cleaned dataset.

### Phase 7 --- Power BI dashboard

Import the same cleaned CSV into Power BI Desktop.

Create report pages:

1.  Executive summary
2.  Customer churn segmentation
3.  Revenue and charges analysis
4.  Model evaluation (using exported model metrics, if useful)

Create DAX measures for:

-   Total Customers
-   Churned Customers
-   Retained Customers
-   Churn Rate
-   Average Monthly Charges
-   Churned Customer Monthly Charges

Use appropriate filter context and ensure measures are not accidentally
counting duplicate customers.

Requirements:

-   Use Power Query for data preparation where needed.
-   Use a star schema only if the model's complexity warrants it.
-   Add slicers for contract, internet service, payment method, and
    tenure bands.
-   Use descriptive titles, tooltips, and consistent KPI definitions.
-   Save the `.pbix` file in `dashboards/powerbi/`.

Acceptance criteria:

-   Report opens without broken queries.
-   Slicers affect the intended visuals.
-   KPIs reconcile with the source dataset and Tableau dashboard.
-   Document any differences in calculation or filtering.

### Phase 8 --- Integration, testing, and deployment

#### Integration

-   Connect React to FastAPI using environment-based API URLs.
-   Confirm the model artifact used by the backend matches the
    documented model version.
-   Ensure the dashboard and API use consistent definitions.
-   Avoid hardcoding dataset statistics in the frontend.

#### Testing

-   Data cleaning tests for expected columns and target values.
-   Model loading and prediction tests.
-   API validation and response tests.
-   Frontend form and error-state tests.
-   Manual end-to-end test from input form to prediction display.
-   Reconcile key metrics across Colab, website, Tableau, and Power BI.

#### Deployment

Suggested options:

-   Frontend: Vercel or Netlify
-   Backend: Render or another Python-compatible hosting service
-   Repository: GitHub
-   BI: Tableau Public (optional) and a local Power BI `.pbix` file

Deployment requirements:

-   Use environment variables for API URLs and configuration.
-   Do not commit credentials or API keys.
-   Document free-tier limits and possible cold starts.
-   Verify the deployed frontend can reach the backend.
-   Provide a clear local setup guide.

Acceptance criteria:

-   The deployed site loads and its health check succeeds.
-   A sample prediction works through the deployed UI.
-   No secrets are committed.
-   The README contains setup, execution, testing, and deployment
    instructions.

## 7. Data Consistency and Metric Definitions

Use consistent definitions across all components.

  -----------------------------------------------------------------------
  Metric                              Definition
  ----------------------------------- -----------------------------------
  Total customers                     Number of unique customer records
                                      in the selected data

  Churned customers                   Count of records where
                                      `Churn = Yes`

  Retained customers                  Count of records where `Churn = No`

  Churn rate                          Churned customers / total customers

  Average monthly charges             Mean `MonthlyCharges` for the
                                      selected population

  Churned customer monthly charges    Sum of `MonthlyCharges` for churned
                                      records; label as an associated
                                      amount, not proven lost revenue
  -----------------------------------------------------------------------

For filtered dashboards, calculate the churn rate using the filtered
population. Document whether any visual uses row counts, distinct
customers, or another aggregation.

## 8. GitHub and Documentation

The README must include:

-   Project overview and problem statement
-   Features
-   Architecture diagram
-   Dataset source and limitations
-   Tech stack
-   Repository structure
-   Setup and run commands
-   How to execute notebooks
-   How to train and evaluate models
-   How to start backend and frontend
-   API endpoint examples
-   Dashboard screenshots and links
-   Model metrics and evaluation notes
-   Deployment links, if available
-   Known limitations and future improvements

Commit work in logical increments. Avoid committing notebook outputs
that are unnecessarily large, environment folders, credentials, or
temporary files.

## 9. Suggested Timeline

  Days     Milestone
  -------- -------------------------------------------------
  1--3     Dataset setup, cleaning, EDA
  4--7     Model training, evaluation, explainability
  8--12    FastAPI backend and React website
  13--14   Tableau dashboards
  15--16   Power BI dashboards
  17--18   Integration, testing, documentation, deployment

This is a target schedule, not a guarantee. Prioritize correctness and
reproducibility over finishing every feature on a fixed date.

## 10. Instructions for the Coding Agent

Work incrementally and do not attempt to generate the entire project in
one unverified step.

1.  Inspect the current workspace before creating or overwriting files.
2.  Start with Phase 1 and confirm the dataset is present and readable.
3.  Implement one phase at a time.
4.  After each phase, run the relevant checks and report the outcome.
5.  Do not invent dataset values, model metrics, or business findings.
6.  Do not fabricate successful test or deployment results.
7.  If a dependency, dataset, or credential is unavailable, explain the
    blocker and provide a safe next step.
8.  Keep reusable logic in source files; notebooks should call reusable
    functions where practical.
9.  Keep data preparation and model inference consistent between Colab
    and the API.
10. Avoid data leakage, particularly during preprocessing, feature
    selection, resampling, and threshold tuning.
11. Never claim that correlation proves causation.
12. Do not claim that a churn model will prevent churn without evidence
    from an intervention.
13. Keep the website and dashboards usable, responsive, and
    understandable to a non-technical reviewer.
14. Update the README as implementation progresses.
15. At the end of each phase, report:
    -   Files created or changed
    -   Work completed
    -   Commands/tests executed and their actual results
    -   Known issues
    -   The next recommended task

## 11. Definition of Done

The project is complete when:

-   The dataset source and cleaning process are documented.
-   The Colab notebooks run reproducibly.
-   EDA findings are supported by computed results.
-   Multiple ML models are compared using appropriate metrics.
-   A reusable model pipeline is saved and reloadable.
-   The FastAPI backend serves predictions and analytics.
-   The React frontend is integrated and responsive.
-   Tableau and Power BI dashboards are built from consistent data.
-   Tests and cross-platform metric checks are completed.
-   GitHub documentation explains how to reproduce the project.
-   Any deployment status and known limitations are accurately reported.
