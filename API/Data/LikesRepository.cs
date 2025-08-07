using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
    {
        var query = context.Likes.AsQueryable();
        

        switch (predicate)
        {
            case "liked":
                return await query
                    .Where(x => x.SourceMemberId == memberId)
                    .Select(x => x.TargetMember)
                    .ToListAsync();
            case "likedBy":
                return await query
                    .Where(x => x.TargetMemberId == memberId)
                    .Select(x => x.SourceMember)
                    .ToListAsync();
            default: //mutual
                var likeIds = await GetCurrentMemberLikeIds(memberId);
                return await query.Where(x => x.TargetMemberId == memberId
                && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember)
                .ToListAsync();
        }
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes2(LikeParams likeParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likeParams.Predicate)
        {
            case "liked":
                result = query
                    .Where(x => x.SourceMemberId == likeParams.UserId)
                    .Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query
                    .Where(x => x.TargetMemberId == likeParams.UserId)
                    .Select(x => x.SourceMember);
                break;
            default: //mutual
                var likeIds = await GetCurrentMemberLikeIds(likeParams.UserId);

                result = query.Where(x => x.TargetMemberId == likeParams.UserId
                && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember);
                break;

        }

        return await PaginationHelper.CreateAsync(result, likeParams.PageNumber, likeParams.PageSize);
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
