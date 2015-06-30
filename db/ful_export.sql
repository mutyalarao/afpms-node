-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2015 at 06:59 AM
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
-- Table structure for table `bran_code_ref`
--

CREATE TABLE IF NOT EXISTS `bran_code_ref` (
  `bran_code` char(4) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `circular_category`
--

CREATE TABLE IF NOT EXISTS `circular_category` (
  `rank_code` varchar(10) NOT NULL,
  `effdt` date NOT NULL,
  `category` char(6) NOT NULL,
  `group` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `circular_tbl`
--

CREATE TABLE IF NOT EXISTS `circular_tbl` (
  `circular_num` int(11) NOT NULL,
  `PPO_type` varchar(10) NOT NULL,
  `effdt` date NOT NULL,
  `rank_code` varchar(10) NOT NULL,
  `category` char(6) NOT NULL,
  `pension_rate` decimal(10,0) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vet_decor_ref`
--

CREATE TABLE IF NOT EXISTS `vet_decor_ref` (
  `decor_code` char(10) NOT NULL,
  `decor_name` varchar(50) NOT NULL,
  `decor_descr` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vet_decor_ref`
--

INSERT INTO `vet_decor_ref` (`decor_code`, `decor_name`, `decor_descr`) VALUES
('PSRI', 'Padma Shria', 'Padma Shri'),
('PVSM', 'Param vishist Seva medal', '');

-- --------------------------------------------------------

--
-- Table structure for table `vet_decor_tbl`
--

CREATE TABLE IF NOT EXISTS `vet_decor_tbl` (
  `service_num` int(11) NOT NULL,
  `decor_code` char(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

-- --------------------------------------------------------

--
-- Table structure for table `vet_rank_ref`
--

CREATE TABLE IF NOT EXISTS `vet_rank_ref` (
  `rank_code` char(6) NOT NULL,
  `rank_name` varchar(50) NOT NULL,
  `rank_descr` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vet_rank_ref`
--

INSERT INTO `vet_rank_ref` (`rank_code`, `rank_name`, `rank_descr`) VALUES
('sqldr', 'squadron leader', 'sdf'),
('wgcdr', 'wing commander', 'aa');

-- --------------------------------------------------------

--
-- Table structure for table `vet_rank_tbl`
--

CREATE TABLE IF NOT EXISTS `vet_rank_tbl` (
  `service_num` int(11) NOT NULL,
  `rank_code` char(10) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `circular_category`
--
ALTER TABLE `circular_category`
 ADD PRIMARY KEY (`rank_code`,`effdt`,`category`,`group`);

--
-- Indexes for table `circular_tbl`
--
ALTER TABLE `circular_tbl`
 ADD PRIMARY KEY (`circular_num`,`PPO_type`,`effdt`,`rank_code`,`category`);

--
-- Indexes for table `vet_decor_ref`
--
ALTER TABLE `vet_decor_ref`
 ADD PRIMARY KEY (`decor_code`);

--
-- Indexes for table `vet_decor_tbl`
--
ALTER TABLE `vet_decor_tbl`
 ADD PRIMARY KEY (`service_num`,`decor_code`), ADD KEY `service_num` (`service_num`,`decor_code`);

--
-- Indexes for table `vet_per_info`
--
ALTER TABLE `vet_per_info`
 ADD PRIMARY KEY (`service_num`,`afa_num`,`EFFDT`), ADD UNIQUE KEY `service_num` (`service_num`);

--
-- Indexes for table `vet_rank_ref`
--
ALTER TABLE `vet_rank_ref`
 ADD PRIMARY KEY (`rank_code`), ADD UNIQUE KEY `rank_code` (`rank_code`);

--
-- Indexes for table `vet_rank_tbl`
--
ALTER TABLE `vet_rank_tbl`
 ADD PRIMARY KEY (`service_num`,`rank_code`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
