SET IDENTITY_INSERT [dbo].[Users] ON
INSERT INTO [dbo].[Users] ([Id], [Username], [PasswordHash], [Email]) VALUES (1, N'1234', N'$2a$10$2nZA8P0Bpy9oIY/OP.ytDu8x/f65aeZdXhTCUu7CZ60nggA2sBSuO', N'esafronov2004@mail.ru')
INSERT INTO [dbo].[Users] ([Id], [Username], [PasswordHash], [Email]) VALUES (2, N'string', N'$2a$10$r/qSF9iAj2As0weFV.SRBuDph5WsN1CX3rv1S27PPfWRYxVI.PTKS', N'user@example.com')
SET IDENTITY_INSERT [dbo].[Users] OFF
