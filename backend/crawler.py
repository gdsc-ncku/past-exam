import os
from urllib.parse import quote_plus

import pandas as pd
import requests
from sqlalchemy import create_engine, text

url = 'https://api.wavjaby.nckuctf.org/api/v0/historySearch?dept=ALL'

response = requests.get(url)
data = response.json()

# Convert to DataFrame
df = pd.DataFrame(data.get('data', []))

# Rename columns to be more descriptive
column_mapping = {
    'y': 'semester',
    'dn': 'departmentId',
    'sn': 'serialNumber',
    'ca': 'attributeCode',
    'sc': 'systemCode',
    'g': 'forGrade',
    'fc': 'forClass',
    'fg': 'forClassGroup',
    'ct': 'category',
    'cn': 'courseName',
    'ci': 'courseNote',
    'cl': 'courseLimit',
    'tg': 'tags',
    'c': 'credits',
    'r': 'required',
    'i': 'instructors',
    's': 'selected',
    'a': 'available',
    't': 'time',
    'pe': 'preferenceEnter',
    'cr': 'courseRegister',
    'pr': 'preRegister',
    'ar': 'addRequest',
}

# Rename columns
df = df.rename(columns=column_mapping)

# Convert data types
df['semester'] = df['semester'].astype(str)
df['departmentId'] = df['departmentId'].astype(str)
df['serialNumber'] = df['serialNumber'].astype(str)
df['attributeCode'] = df['attributeCode'].astype(str)
df['systemCode'] = df['systemCode'].astype(str)
df['forGrade'] = pd.to_numeric(df['forGrade'], errors='coerce')
df['forClass'] = df['forClass'].astype(str)
df['forClassGroup'] = df['forClassGroup'].astype(str)
df['category'] = df['category'].astype(str)
df['courseName'] = df['courseName'].astype(str)
df['courseNote'] = df['courseNote'].astype(str)
df['courseLimit'] = df['courseLimit'].astype(str)
df['credits'] = pd.to_numeric(df['credits'], errors='coerce')
df['required'] = df['required'].astype(bool)
df['selected'] = pd.to_numeric(df['selected'], errors='coerce')
df['available'] = pd.to_numeric(df['available'], errors='coerce')

# Print some basic information about the DataFrame
print(f'Total number of courses: {len(df)}')
print('\nColumns in the dataset:')
print(df.columns.tolist())
print('\nData types of columns:')
print(df.dtypes)
print('\nFirst few rows of the data:')
print(df.head())

# Print some basic statistics before dropping columns
print('\nBasic statistics:')
print(f"Number of departments: {df['departmentId'].nunique()}")
print(f"Number of instructors: {df['instructors'].explode().nunique()}")
print(f"Total credits offered: {df['credits'].sum()}")

# Drop less essential columns
columns_to_drop = [
    'forClassGroup',  # Usually null
    'courseLimit',  # Usually null
    'selected',
    'available',
    'time',
    'required',
]

df = df.drop(columns=columns_to_drop)

# Save as CSV for easier viewing
csv_file_name = 'courses.csv'
df.to_csv(csv_file_name, index=False, encoding='utf-8')

# Database connection parameters
user = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
host = os.getenv('POSTGRES_IP')
port = os.getenv('POSTGRES_PORT')
dbname = os.getenv('POSTGRES_DB')

DB_PARAMS = {'dbname': dbname, 'user': user, 'password': password, 'host': host, 'port': port}

# Create SQLAlchemy engine
password = quote_plus(DB_PARAMS['password'])
engine = create_engine(
    f"postgresql://{DB_PARAMS['user']}:{password}@{DB_PARAMS['host']}:{DB_PARAMS['port']}/{DB_PARAMS['dbname']}"
)

# Convert list columns to string representation for database storage
df['instructors'] = df['instructors'].apply(lambda x: ','.join(x) if isinstance(x, list) else x)
df['tags'] = df['tags'].apply(lambda x: ','.join(x) if isinstance(x, list) else x)

# Create table and insert data
try:
    # Drop existing table if it exists
    with engine.connect() as conn:
        conn.execute(text('DROP TABLE IF EXISTS courses'))
        conn.commit()

    # Create new table and insert data
    df.to_sql('courses', engine, if_exists='replace', index=False)
    print('\nSuccessfully inserted data into PostgreSQL database!')

    # Print table information
    with engine.connect() as conn:
        result = conn.execute(text('SELECT COUNT(*) FROM courses')).scalar()
        print(f'Total records in database: {result}')

except Exception as e:
    print(f'\nError connecting to database: {str(e)}')
    print('Please make sure PostgreSQL is running and the database parameters are correct.')
