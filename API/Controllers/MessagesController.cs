using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IMessageRepository messageRepository,
    IMemberRepository memberRepository) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
    {
        var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDTO.RecipientId)
            return BadRequest("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDTO.Content
        };

        messageRepository.AddMessage(message);
        if (await messageRepository.SaveAllAsync()) return message.ToDto();

        return BadRequest("Fail to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessagesByContainer([FromQuery] MessagesParams messagesParams)
    {
        messagesParams.MemberId = User.GetMemberId();
        return await messageRepository.GetMessagesForMember(messagesParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDTO>>> GetMessageThread(string recipientId)
    {
        return Ok(await messageRepository.GetMessageThread(User.GetMemberId(), recipientId));
    }

    [HttpDelete("{messageId}")]
    public async Task<ActionResult> DeleteMessage(string messageId)
    {
        var userId = User.GetMemberId();

        var currentMessage = await messageRepository.GetMessage(messageId);
        if (currentMessage == null) return BadRequest("Remove message failed");

        if (currentMessage.SenderId != userId
            && currentMessage.RecipientId != userId)
            return BadRequest("You cannot delete this message");

        if (currentMessage.SenderId == userId) currentMessage.SenderDeleted = true;
        if (currentMessage.RecipientId == userId) currentMessage.RecipientDeleted = true;

        if (currentMessage is { SenderDeleted: true, RecipientDeleted: true })
        {
            messageRepository.DeleteMessage(currentMessage);
        }

        if (await messageRepository.SaveAllAsync()) return Ok();

        return BadRequest("Remove message failed");
    }
    

}

