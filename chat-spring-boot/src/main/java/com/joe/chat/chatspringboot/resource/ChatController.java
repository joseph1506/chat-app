package com.joe.chat.chatspringboot.resource;

import com.joe.chat.chatspringboot.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    SimpMessagingTemplate template;

    @MessageMapping("/chat/message")
    public void receiveMessgaeAndPublish(@Payload Message message){
        this.template.convertAndSend("/chat",message);
    }


    @MessageMapping("/chat/join")
    public void joinUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        this.template.convertAndSend("/chat",message);
    }
}
