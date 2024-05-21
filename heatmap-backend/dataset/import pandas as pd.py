import pandas as pd

# File path to the final CSV file
final_data_path = r'F:\KSP\Shadow\heatmap-backend\dataset\final.csv'
output_path = r'F:\KSP\Shadow\heatmap-backend\dataset\final_unique.csv'

# Read the CSV file
final_df = pd.read_csv(final_data_path)

# Remove rows where 'crime_no' is not unique
unique_crime_no_df = final_df[final_df['crime_no'].duplicated(keep=False) == False]

# Save the resulting dataframe to a new CSV file
unique_crime_no_df.to_csv(output_path, index=False)

print(f"Rows with unique 'crime_no' saved to {output_path}")
