CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`japanese` text NOT NULL,
	`reading` text,
	`meaning` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_reviewed_at` integer,
	`due_at` integer,
	`status` text DEFAULT 'new'
);
