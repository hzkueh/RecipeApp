using System;

namespace API.Helpers;

public class MessagesParams : PagingParams
{
    public string MemberId { get; set; } = "";
    public string Container { get; set; } = "Inbox";
}
