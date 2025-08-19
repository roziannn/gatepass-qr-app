-- CreateTable
CREATE TABLE `EventCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EventCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `quota` INTEGER NOT NULL,
    `participantCount` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('PENDING', 'ACTIVE', 'CANCELLED', 'FINISHED') NOT NULL DEFAULT 'PENDING',
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `eventId` INTEGER NOT NULL,
    `status` ENUM('REGISTERED', 'ATTENDED', 'ABSENT', 'CANCELLED') NOT NULL DEFAULT 'REGISTERED',
    `ticketCode` VARCHAR(191) NOT NULL,
    `scanDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Participant_ticketCode_key`(`ticketCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `EventCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
