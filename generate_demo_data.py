import csv
import random
from datetime import datetime, timedelta

def generate_business_data(filename="founder_demo_data.csv", num_records=100):
    headers = ["Date", "Metric", "Value", "Category"]
    metrics = ["Revenue", "Active Users", "Churn Rate", "Customer Acquisition Cost"]
    categories = ["Organic", "Paid", "Referral", "Direct"]

    start_date = datetime.now() - timedelta(days=num_records)

    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)

        for i in range(num_records):
            current_date = start_date + timedelta(days=i)
            
            for metric in metrics:
                category = random.choice(categories)
                if metric == "Revenue":
                    value = round(random.uniform(1000, 5000), 2)
                    if i % 10 == 0:  # Introduce an anomaly
                        value = round(random.uniform(8000, 10000), 2)
                elif metric == "Active Users":
                    value = int(random.uniform(500, 2000))
                elif metric == "Churn Rate":
                    value = round(random.uniform(0.01, 0.05), 3)
                elif metric == "Customer Acquisition Cost":
                    value = round(random.uniform(10, 50), 2)

                writer.writerow([current_date.strftime("%Y-%m-%d"), metric, value, category])

    print(f"Demo data generated successfully in {filename}")

if __name__ == "__main__":
    generate_business_data()
