-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2015 at 09:29 PM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `vet_per_info`
--

CREATE TABLE IF NOT EXISTS `vet_per_info` (
  `service_num` int(10) NOT NULL,
  `afa_num` int(10) NOT NULL,
  `EFFDT` date NOT NULL,
  `name` text NOT NULL,
  `address` text NOT NULL,
  `city` varchar(50) NOT NULL,
  `RANK` char(4) NOT NULL,
  `INITIAL` char(1) NOT NULL,
  `STATUS` char(4) NOT NULL,
  `ADD1` varchar(100) NOT NULL,
  `ADD2` varchar(100) NOT NULL,
  `ADD3` varchar(100) NOT NULL,
  `BRAN_CODE` char(4) NOT NULL,
  `RETIRE_DT` date NOT NULL,
  `SPOUSE` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `ENROLL_DT` date NOT NULL,
  `PPO_type` char(6) NOT NULL,
  `Group_Code` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vet_per_info`
--
ALTER TABLE `vet_per_info`
 ADD PRIMARY KEY (`service_num`,`afa_num`,`EFFDT`), ADD UNIQUE KEY `service_num` (`service_num`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
