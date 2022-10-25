/*
  Warnings:

  - Added the required column `ticketType` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `ticketStatus` ENUM('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `ticketType` ENUM('LONG_TERM', 'SHORT_TERM') NOT NULL;
