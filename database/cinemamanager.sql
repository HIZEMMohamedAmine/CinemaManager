-- XAMPP-Lite
-- version 8.4.1
-- https://xampplite.sf.net/
--
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2026 at 09:37 PM
-- Server version: 11.4.4-MariaDB-log
-- PHP Version: 8.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cinemamanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `films`
--

CREATE TABLE `films` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(180) NOT NULL,
  `genre` varchar(80) NOT NULL,
  `duration_minutes` smallint(5) UNSIGNED NOT NULL,
  `classification` varchar(20) NOT NULL,
  `synopsis` text DEFAULT NULL,
  `poster_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `films`
--

INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES
(21, 'Oppenheimer', 'Action', 180, 'G', 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'https://image.tmdb.org/t/p/w500/8GxvA9zT0U7Q2SbeMv02DNmZZXH.jpg', 1, '2026-04-10 23:40:19', '2026-04-10 23:55:17'),
(22, 'Spider-Man: Across the Spider-Verse', 'Animation', 140, 'PG', 'Miles Morales catapults across the Multiverse to protect its existence.', 'https://image.tmdb.org/t/p/w500/8VtB9m91Spx6j6PROmMGurlr9jD.jpg', 1, '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(23, 'The Batman', 'Action/Crime', 176, 'PG-13', 'Batman ventures into Gothams underworld to track a sadistic killer.', 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onun.jpg', 1, '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(24, 'Past Lives', 'Romance/Drama', 105, 'PG-13', 'Two deeply connected childhood friends are reunited for one fateful week.', 'https://image.tmdb.org/t/p/w500/897S6S86Z77D38N9H0i5S0I83I.jpg', 1, '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(25, 'Sahbk Rajel 2', 'Comedy', 100, 'G', '', 'https://teskerti.tn/evenement/sahbek-rajel-2-le-2101', 1, '2026-04-11 20:22:21', '2026-04-11 20:22:21');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_code` varchar(20) NOT NULL,
  `seance_id` int(10) UNSIGNED NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(190) NOT NULL,
  `tickets_count` smallint(5) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Confirmee','Attente','Annulee') NOT NULL DEFAULT 'Confirmee',
  `reserved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salle`
--

CREATE TABLE `salle` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `capacity` smallint(5) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salle`
--

INSERT INTO `salle` (`id`, `name`, `capacity`, `created_at`) VALUES
(10, 'Grand IMAX Hall', 250, '2026-04-10 23:40:19'),
(11, 'VIP Lounge', 40, '2026-04-10 23:40:19'),
(12, 'Standard Room 4', 100, '2026-04-10 23:40:19'),
(13, 'LOQ', 10, '2026-04-10 23:54:56');

-- --------------------------------------------------------

--
-- Table structure for table `seances`
--

CREATE TABLE `seances` (
  `id` int(10) UNSIGNED NOT NULL,
  `film_id` int(10) UNSIGNED NOT NULL,
  `room_id` int(10) UNSIGNED DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `total_seats` smallint(5) UNSIGNED NOT NULL,
  `available_seats` smallint(5) UNSIGNED NOT NULL,
  `base_price` decimal(8,2) NOT NULL,
  `status` enum('Disponible','Complet','Annule') NOT NULL DEFAULT 'Disponible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seances`
--

INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES
(101, 21, 10, '2026-04-15 19:00:00', 250, 248, 15.00, 'Disponible', '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(102, 22, 12, '2026-04-15 14:30:00', 100, 95, 12.00, 'Disponible', '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(103, 24, 11, '2026-04-16 20:00:00', 40, 38, 20.00, 'Disponible', '2026-04-10 23:40:19', '2026-04-10 23:40:19'),
(104, 23, 10, '2026-04-22 14:40:00', 250, 250, 15.00, 'Disponible', '2026-04-10 23:40:56', '2026-04-10 23:40:56'),
(105, 21, 10, '2026-04-20 10:00:00', 250, 250, 15.00, 'Disponible', '2026-04-10 23:46:42', '2026-04-10 23:46:42'),
(106, 21, 10, '2026-04-20 10:00:00', 250, 250, 15.00, 'Disponible', '2026-04-10 23:47:06', '2026-04-10 23:47:06'),
(107, 24, 10, '2026-04-20 10:00:00', 250, 250, 15.00, 'Disponible', '2026-04-10 23:50:07', '2026-04-10 23:50:07'),
(108, 24, 10, '2026-04-11 01:03:00', 250, 250, 15.00, 'Disponible', '2026-04-11 00:00:44', '2026-04-11 00:00:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', 'admin', 'admin'),
(8, 'user', 'user', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_films_title` (`title`),
  ADD KEY `idx_films_genre` (`genre`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_code` (`booking_code`),
  ADD KEY `fk_reservations_seance` (`seance_id`),
  ADD KEY `idx_reservations_status` (`status`),
  ADD KEY `idx_reservations_email` (`customer_email`);

--
-- Indexes for table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `seances`
--
ALTER TABLE `seances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_seances_film` (`film_id`),
  ADD KEY `fk_seances_room` (`room_id`),
  ADD KEY `idx_seances_start_time` (`start_time`),
  ADD KEY `idx_seances_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `films`
--
ALTER TABLE `films`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salle`
--
ALTER TABLE `salle`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `seances`
--
ALTER TABLE `seances`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_reservations_seance` FOREIGN KEY (`seance_id`) REFERENCES `seances` (`id`);

--
-- Constraints for table `seances`
--
ALTER TABLE `seances`
  ADD CONSTRAINT `fk_seances_film` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`),
  ADD CONSTRAINT `fk_seances_room` FOREIGN KEY (`room_id`) REFERENCES `salle` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
