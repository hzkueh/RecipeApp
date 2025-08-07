using System;

namespace API.Helpers;

public class LikeParams : PagingParams
{
    public string UserId { get; set; } = "";
    public string Predicate { get; set; } = "liked";
    
}
