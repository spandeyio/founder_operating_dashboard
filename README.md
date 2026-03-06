<div align="center">
  <h1>Founder Operating Dashboard</h1>
  <p><i>A lightweight, professional-grade Data Analytics Agent tailored for founders.</i></p>
</div>

<p align="center">
  Upload your structured business data (CSV), and the AI automatically generates operational insights, anomaly alerts, and automated dashboards in plain English. Built with <b>LangChain</b>, <b>Google Gemini</b>, <b>FastAPI</b>, and <b>PostgreSQL</b>.
</p>

---

## ✨ Features

<ul>
  <li><b>Automated Insights & Anomalies</b>: Upload CSV data to instantly get operational insights and alerts on unusual spikes or drops in metrics.</li>
  <li><b>Natural Language to SQL</b>: Converts plain-English queries (e.g., "Show revenue over time") into optimized SQL for generating widgets.</li>
  <li><b>Data Ingestion</b>: Seamlessly import structured business data via CSV.</li>
  <li><b>Interactive Dashboard</b>: A modern web interface focused on usability and clear metrics presentation.</li>
  <li><b>Smart Suggestions</b>: Provides context-aware prompts (e.g., CAC Analysis, Executive Dashboard) to guide data exploration.</li>
  <li><b>Transparency & Visualizations</b>: Automatically generates Chart.js visualizations alongside the executed SQL query for easy verification.</li>
</ul>

---

## 🛠 Prerequisites

<ul>
  <li>Python 3.10+</li>
  <li>PostgreSQL Database</li>
  <li>Google Gemini API Key</li>
</ul>

---

## 🚀 Installation

<h3>1. Clone the repository</h3>
<pre><code>git clone <repository-url>
cd data_analytics_agent</code></pre>

<h3>2. Install dependencies</h3>
<p>Using <code>uv</code> (recommended):</p>
<pre><code>uv sync</code></pre>
<p>Or using standard pip:</p>
<pre><code>pip install -r requirements.txt</code></pre>
<p><i>(Note: Ensure <code>psycopg2-binary</code>, <code>fastapi</code>, <code>uvicorn</code>, <code>langchain-google-genai</code>, <code>python-dotenv</code> are installed).</i></p>

<h3>3. Configure Environment</h3>
<p>Create a <code>.env</code> file in the root directory with the following variables:</p>
<pre><code>GOOGLE_API_KEY=your_gemini_api_key

# Database Credentials
user=your_db_user
password=your_db_password
host=localhost
port=5432
dbname=your_db_name

# Legacy/Optional (if using Supabase REST)
SUPABASE_URL=...
SUPABASE_KEY=...</code></pre>

<h3>4. Database Setup</h3>
<p>Ensure your PostgreSQL database is running. The application handles dynamic table creation when you upload CSV data.</p>

<h3>5. Generate Demo Data (Optional)</h3>
<p>We've included a Python script to quickly generate suitable demo business data for the dashboard:</p>
<pre><code>python generate_demo_data.py</code></pre>
<p>This will generate <code>founder_demo_data.csv</code> in your root folder.</p>

---

## 💻 Running the Application

<p>Start the FastAPI server:</p>

<pre><code>python main.py</code></pre>

<p>The application will be available at <a href="http://localhost:8000"><b>http://localhost:8000</b></a>.</p>

---

## 📖 Usage

<ol>
  <li>Open the dashboard in your browser.</li>
  <li>Upload a CSV file (e.g., <code>founder_demo_data.csv</code>) using the "Import Data" section in the sidebar.</li>
  <li>Click on one of the <b>Suggested Prompts</b> (e.g., "Revenue Overview") or type your own query.</li>
  <li>The agent will:
    <ul>
      <li>Generate a SQL query based on your request.</li>
      <li>Execute it against your uploaded data table.</li>
      <li>Provide operational insights and anomaly alerts in plain English.</li>
      <li>Render visualizations and structured data layouts automatically.</li>
    </ul>
  </li>
</ol>

---

## 🔧 Tech Stack

<ul>
  <li><b>Backend</b>: Python, FastAPI</li>
  <li><b>AI/LLM</b>: LangChain, Google Gemini (gemini-1.5-flash)</li>
  <li><b>Database</b>: PostgreSQL (psycopg2)</li>
  <li><b>Frontend</b>: HTML5, CSS3 (Glassmorphism), JavaScript</li>
</ul>
