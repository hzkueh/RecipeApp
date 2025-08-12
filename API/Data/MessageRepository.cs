using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDTO>> GetMessagesForMember(MessagesParams messagesParams)
    {
        var query = context.Messages
        .OrderByDescending(x => x.MessageSent)
        .AsQueryable();

        query = messagesParams.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messagesParams.MemberId
                && x.SenderDeleted == false),
            _ => query.Where(x => x.RecipientId == messagesParams.MemberId && x.RecipientDeleted == false)
        };

        var messageQuery = query.Select(MessageExtension.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messageQuery, messagesParams.PageNumber, messagesParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDTO>> GetMessageThread(string currentMemberId, string recipientId)
    {
        //find unread messages
        await context.Messages
            .Where(x => x.RecipientId == currentMemberId
                && x.SenderId == recipientId
                && x.DateRead == null)
                //marking messages as read
                .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.DateRead, DateTime.UtcNow));

        return await context.Messages
            .Where(x => (x.RecipientId == currentMemberId
                && x.RecipientDeleted == false
                && x.SenderId == recipientId)
            || (x.SenderId == currentMemberId
                && x.SenderDeleted == false
                && x.RecipientId == recipientId))
            .OrderBy(x => x.MessageSent)
            .Select(MessageExtension.ToDtoProjection())
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
