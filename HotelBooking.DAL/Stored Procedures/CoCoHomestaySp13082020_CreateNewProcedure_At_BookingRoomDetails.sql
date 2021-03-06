USE [CoCoHomeStayDb]
GO
/****** Object:  StoredProcedure [dbo].[BookingRoomDetails_DisplayBookingRoomTypesByBookingId]    Script Date: 13/08/2020 9:58:31 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author: QuangNguyen>
-- Create date: <Create Date: 30/07/2020>
-- Description:	<Description: BookingRoomDetails_DisplayBookingRoomTypesByBookingId>
-- =============================================
CREATE PROCEDURE [dbo].[BookingRoomDetails_DisplayBookingRoomTypesByBookingId]
	-- Add the parameters for the stored procedure here
	@BookingId INT
AS

BEGIN

SELECT RoomTypeId, RoomQuantity
  FROM [dbo].BOOKINGROOMDETAILS
  WHERE @BookingId = BOOKINGROOMDETAILS.BookingId AND EXISTS(SELECT * FROM [dbo].BOOKING WHERE @BookingId = BOOKING.BookingId AND BOOKING.IsCanceled = 0)
  GROUP BY RoomTypeId, RoomQuantity
END
