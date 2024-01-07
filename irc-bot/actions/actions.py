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
from pymongo import MongoClient

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
        dispatcher.utter_message(text="Uspešno poslano na Angular aplikaciju.")

        return []

class ExtractShoeEntity(Action):

    def name(self) -> Text:
        return "action_extract_shoe_entity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            shoe_entity = next(tracker.get_latest_entity_values('shoes'), None)

            if shoe_entity:
                 dispatcher.utter_message(text=f"You have selected {shoe_entity} as your shoe choice")
            else:
                 dispatcher.utter_message(text="I'am sorry I could not detected the shoe choice")

            return []
    
class OrderFootwearActions(Action):
    def name(self)-> Text:
        return 'action_order_footwear'

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
         dispatcher.utter_message(text="Sure, which kind of footwear would you like to order")
         return []
    
class OrderFootwearActions(Action):
    def name(self)-> Text:
        return 'action_confirm_order'

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            shoe_entity = next(tracker.get_latest_entity_values('shoes'), None)

            if shoe_entity:
                 dispatcher.utter_message(text=f"I have ordered {shoe_entity} for you")
            else:
                 dispatcher.utter_message(text="I'am sorry I could not detected the shoe choice")

            return []    
    
# class ActionShowCarousel(Action):
#     def name(self) -> Text:
#         return "action_show_carousel"
    
#     def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#         message = {
#             "type": "template",
#             "payload": {
#                 "template_type": "generic",
#                 "elements": [
#                     {
#                         "title": "Carousel 1",
#                         "subtitle": "$10",
#                         "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqhmyBRCngkU_OKSL6gBQxCSH-cufgmZwb2w&usqp=CAU",
#                         "buttons": [ 
#                             {
#                                 "title": "Happy",
#                                 "payload": "Happy",
#                                 "type": "postback"
#                             },
#                             {
#                                 "title": "sad",
#                                 "payload": "sad",
#                                 "type": "postback"
#                             }
#                         ]
#                     },
#                     {
#                         "title": "Carousel 2",
#                         "subtitle": "$12",
#                         "image_url": "https://image.freepik.com/free-vector/city-illustration_23-2147514701.jpg",
#                         "buttons": [ 
#                             {
#                                 "title": "Click here",
#                                 "url": "https://image.freepik.com/free-vector/city-illustration_23-2147514701.jpg",
#                                 "type": "web_url"
#                             }
#                         ]
#                     }
#                 ]
#             }
#         }
#         dispatcher.utter_message(text="Here are some of our brend shes", attachment=message)
#         return []
    

# class ActionOpenLink(Action):
#     def name(self) -> Text:
#         return "action_open_link"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

#         link = "https://www.link.com"
#         dispatcher.utter_message(text=f"Otvara se link: {link}")

#         return []