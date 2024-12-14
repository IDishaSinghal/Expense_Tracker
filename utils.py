import json

def load_def():
    try:
        with open('storage.json','r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {"income": [], "expenses": []}
    return data 

def save_data(data):
    with open('storage.json','w') as file:
        json.dump(data , file , indent=4)

def get_total_income(data):
    return sum(item['amount'] for item in data['income'])

def get_total_expenses(data):
    return sum(item['amount'] for item in data['expenses'])

def get_balance(data):
    return get_total_income(data) - get_total_expenses(data)