# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

# from typing import Dict, Text, Any, List
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
# from rasa_sdk.events import SlotSet

# class ActionShowProducts(Action):
#     def name(self):
#         return "action_show_products"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
#         is_user_logged_in = False  # Ovo bi bilo provjereno prema tvojoj bazi podataka/korisničkom sistemu
        
#         if is_user_logged_in:
#             # Prikaži proizvode
#             dispatcher.utter_message(template="utter_show_products")
#         else:
#             # Korisnik nije ulogovan, prikaži login poruku/dugme
#             dispatcher.utter_message(template="utter_show_login_button")
        
#         return []

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

class ActionSendToAngular(Action):
    def name(self) -> Text:
        return "action_send_to_angular"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Implementirajte logiku slanja podataka na vaš Angular URL
        message = tracker.latest_message.get('text')

        # Primjer slanja POST zahtjeva
        url = "http://localhost:5005/webhooks/rest/webhook"  # Vaš Angular URL
        payload = {"message": message}
        response = requests.post(url, json=payload)

        # Ovdje možete obraditi odgovor ako je potrebno
        dispatcher.utter_message(text="Uspješno poslano na Angular aplikaciju.")

        return []
