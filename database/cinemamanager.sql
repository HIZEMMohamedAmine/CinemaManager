-- XAMPP-Lite
-- version 8.4.1
-- https://xampplite.sf.net/
--
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2026 at 09:10 PM
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
(34, 'Jumanji: The Next Level', 'Comedy', 123, 'PG-13', 'In Jumanji: The Next Level, the gang is back but the game has changed. As they return to rescue one of their own, the players will have to brave parts unknown from arid deserts to snowy mountains, to escape the world\'s most dangerous game.', '/CinemaManager/images/jumanji_the_next_level.jpg', 1, '2026-04-17 20:57:48', '2026-04-17 20:57:48'),
(35, 'Peaky Blinders: The Immortal Man', 'Drama', 112, 'G', 'During World War II, Tommy Shelby returns to a bombed Birmingham and becomes involved in secret wartime missions facing new threats as he reckons with his past.', '/CinemaManager/images/peaky_blinders_the_immortal_man.jpg', 1, '2026-04-17 20:59:55', '2026-04-17 20:59:55'),
(36, 'Home Alone', 'Comedy', 103, 'G', 'An eight-year-old troublemaker, mistakenly left home alone, must defend his home against a pair of burglars on Christmas Eve.', '/CinemaManager/images/home_alone.jpg', 1, '2026-04-17 21:01:27', '2026-04-17 21:01:27'),
(37, 'Sahbek Rajel 2', 'Comedy', 135, 'G', 'Azouz and Mehdi\'s rivalry flares up again, but over a new conflict. Their hot tempers and provocative ways turn every moment into a comic battle filled with stunts and wild twists.', '/CinemaManager/images/sahbek_rajel_2.jpg', 1, '2026-04-17 21:02:42', '2026-04-17 21:02:42'),
(38, 'Lakcha Men Essma', 'Comedy', 110, 'G', 'Un loser tunisien attachant, escroc à ses heures perdues, interprété par Bassem El Hamraoui, voit sa vie bouleversée lorsqu’il croise la route d’un extraterrestre métamorphe capable de prendre l’apparence de tout ce qu’il observe.\r\n\r\nEntre quiproquos improbables et situations absurdes, ce duo inattendu se retrouve embarqué dans une aventure aussi délirante que satirique. Derrière l’humour et la comédie se dessine peu à peu une mission inattendue : sauver le monde.', '/CinemaManager/images/lakcha_men_essma.jpg', 1, '2026-04-17 21:03:59', '2026-04-17 21:03:59');

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
(14, 'Salle 1', 100, '2026-04-17 21:05:28'),
(15, 'Salle 2', 150, '2026-04-17 21:05:37');

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
(110, 38, 14, '2026-04-24 17:00:00', 100, 100, 12.00, 'Disponible', '2026-04-17 21:06:10', '2026-04-17 21:06:10'),
(111, 38, 14, '2026-04-24 20:00:00', 100, 100, 12.00, 'Disponible', '2026-04-17 21:06:30', '2026-04-17 21:06:51'),
(112, 35, 14, '2026-04-25 16:00:00', 100, 100, 10.00, 'Disponible', '2026-04-17 21:07:11', '2026-04-17 21:07:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `email` varchar(150) NOT NULL,
  `tel` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `tel`) VALUES
(13, 'admin', 'admin', 'admin', '', '');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `salle`
--
ALTER TABLE `salle`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `seances`
--
ALTER TABLE `seances`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
