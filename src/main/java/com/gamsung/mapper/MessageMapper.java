package com.gamsung.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gamsung.vo.InChatMessageVO;

@Mapper
public interface MessageMapper {

	List<InChatMessageVO> selectMessageList(HashMap<String, String> params);

	void insertMessage(InChatMessageVO message);

	List<InChatMessageVO> selectMyChatList(String sender);
}
