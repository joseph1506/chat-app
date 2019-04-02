package com.joe.chat.chatspringboot.eventListener;

import com.joe.chat.chatspringboot.model.Message;
import com.joe.chat.chatspringboot.model.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    @Autowired
    SimpMessagingTemplate template;

    @EventListener
    public void handleWebSocketConnectEvent(SessionConnectedEvent event){
        System.out.println("Connection started");
    }

    @EventListener
    public void handleWebSocketDisconnectEvent(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userName = (String) headerAccessor.getSessionAttributes().get("username");
        if(userName!=null){
            Message leave= new Message();
            leave.setContent(userName +" left the chat");
            leave.setType(Type.LEAVE);
            template.convertAndSend("/chat",leave);
        }
    }

}
