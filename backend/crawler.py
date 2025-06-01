import os
from urllib.parse import quote_plus

import pandas as pd
from sqlalchemy import create_engine, text

df = pd.DataFrame()

with open('combined_courses_1130_1131.csv', 'r') as f:
    df = pd.read_csv(
        f, na_values=[], keep_default_na=False, dtype=str
    )  # Read all as string initially
    # Replace 'nan' strings with actual NaN
    df = df.replace('nan', pd.NA)


# Database connection parameters
user = os.getenv('POSTGRES_USER')
password = os.getenv('POSTGRES_PASSWORD')
host = os.getenv('POSTGRES_HOST')
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

# Drop columns that don't exist in the database model
columns_to_drop = ['forClassGroup', 'courseLimit', 'required', 'selected', 'available', 'time']
df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])

# Drop rows with NaN serialNumber
df = df.dropna(subset=['serialNumber'])
df = df[df['serialNumber'] != '<NA>']
print(f'Number of rows after dropping NaN serialNumber: {len(df)}')
print(df['serialNumber'])
# Convert serialNumber from float string to int string
# df['serialNumber'] = df['serialNumber'].astype(float).astype(int).astype(str)   
df['serialNumber'] = df['serialNumber'].astype(str).str.zfill(3)
df['course_id'] = df['departmentId'] + df['serialNumber']

# Print rows with null course_id
null_courses = df[df['course_id'].isna()]
print('\nRows with null course_id:')
print(null_courses)
print(f'\nTotal rows with null course_id: {len(null_courses)}')
print(df['course_id'])

# Print rows with duplicate course_id
dup_courses = df[df['course_id'].duplicated(keep=False)]
print('\nRows with duplicate course_id:')
print(dup_courses)
print(f'\nTotal rows with duplicate course_id: {len(dup_courses)}')

# Drop duplicate course_id entries (keep the first occurrence)
df = df.drop_duplicates(subset=['course_id'], keep='first')
print(f'\nRows after dropping duplicates: {len(df)}')


# Create table and insert data
try:

    # Create new table and insert data
    df.to_sql('courses', engine, if_exists='append', index=False)

        

    # Print table information
    with engine.connect() as conn:
        result = conn.execute(text('SELECT COUNT(*) FROM courses')).scalar()
        print(f'Total records in database: {result}')

except Exception as e:
    print(f'\nError connecting to database: {str(e)}')
    print('Please make sure PostgreSQL is running and the database parameters are correct.')
