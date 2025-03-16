# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.group_name = f'notifications_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def notify(self, event):
        await self.send(text_data=json.dumps(event["content"]))