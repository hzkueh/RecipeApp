using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
    {
        var sender = await uow.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDTO.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDTO.RecipientId)
            return BadRequest("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDTO.Content
        };

        uow.MessageRepository.AddMessage(message);
        if (await uow.Complete()) return message.ToDto();

        return BadRequest("Fail to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDTO>>> GetMessagesByContainer([FromQuery] MessagesParams messagesParams)
    {
        messagesParams.MemberId = User.GetMemberId();
        return await uow.MessageRepository.GetMessagesForMember(messagesParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDTO>>> GetMessageThread(string recipientId)
    {
        return Ok(await uow.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId));
    }

    [HttpDelete("{messageId}")]
    public async Task<ActionResult> DeleteMessage(string messageId)
    {
        var userId = User.GetMemberId();

        var currentMessage = await uow.MessageRepository.GetMessage(messageId);
        if (currentMessage == null) return BadRequest("Remove message failed");

        if (currentMessage.SenderId != userId
            && currentMessage.RecipientId != userId)
            return BadRequest("You cannot delete this message");

        if (currentMessage.SenderId == userId) currentMessage.SenderDeleted = true;
        if (currentMessage.RecipientId == userId) currentMessage.RecipientDeleted = true;

        if (currentMessage is { SenderDeleted: true, RecipientDeleted: true })
        {
            uow.MessageRepository.DeleteMessage(currentMessage);
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Remove message failed");
    }
    

}

