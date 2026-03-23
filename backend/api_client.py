import requests
BASE_URL = "http://localhost:5000"   # change if your backend runs elsewhere

def update_entity(entity_id, update_data):
    try:
        url = f"{BASE_URL}/update/{entity_id}"
        
        response = requests.put(url, json=update_data)
        response.raise_for_status()   # raises HTTPError if failed
        
        return response.json()

    except requests.exceptions.HTTPError as e:
        print(f"HTTP error while updating: {e}")

    except requests.exceptions.ConnectionError:
        print("Connection error - Check your BASE_URL")

    except Exception as e:
        print(f"Unexpected error: {e}")


# Example usage
if __name__ == "__main__":
    updated = update_entity(
        entity_id="your_entity_id_here",
        update_data={"fieldname": "newValue"}
    )
    print("Updated:", updated)