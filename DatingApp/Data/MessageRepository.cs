﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.Include(u=>u.Sender).Include(u=>u.Recipient).SingleOrDefaultAsync(x=>x.Id == id);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();
            query = messageParams.Container switch
            {
                "inbox" => query.Where(u => u.Recipient.UserName == messageParams.Username && !u.RecipientDeleted),
                "outbox" => query.Where(u => u.Sender.UserName == messageParams.Username && !u.SenderDeleted),
                _ => query.Where(u => u.Recipient.UserName == messageParams.Username && !u.RecipientDeleted && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages
                                .Include(u=>u.Sender).ThenInclude(p=>p.Photos)
                                .Include(u=>u.Recipient).ThenInclude(p=>p.Photos)
                                .Where(m=>m.Recipient.UserName==currentUsername && !m.RecipientDeleted
                                       && m.Sender.UserName == recipientUsername 
                                       || m.Recipient.UserName == recipientUsername
                                       && m.Sender.UserName==currentUsername && !m.SenderDeleted
                           ).OrderBy(m=>m.MessageSent)
                            .ToListAsync();
            var unreadMessages = messages.Where(m => m.DateRead == null && m.Recipient.UserName == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach(var m in unreadMessages)
                {
                    m.DateRead = DateTime.Now;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
