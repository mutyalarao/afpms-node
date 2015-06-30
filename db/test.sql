-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2015 at 07:35 AM
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
  `vet_group_cd` char(6) NOT NULL,
  `circ_category` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `circular_category`
--

INSERT INTO `circular_category` (`rank_code`, `effdt`, `vet_group_cd`, `circ_category`) VALUES
('AC', '1900-01-01', 'I', 1),
('AC', '1900-01-01', 'II', 2),
('AC', '1900-01-01', 'III', 2),
('AC', '1900-01-01', 'IV', 2),
('AC', '1900-01-01', 'V', 3),
('AC', '1973-01-01', 'I', 1),
('AC', '1973-01-01', 'II', 2),
('AC', '1973-01-01', 'III', 2),
('AC', '1973-01-01', 'IV', 3),
('AC', '1997-10-10', 'X', 1),
('AC', '1997-10-10', 'Y', 2),
('AC', '1997-10-10', 'Z', 3),
('CPL', '1900-01-01', 'I', 7),
('CPL', '1900-01-01', 'II', 8),
('CPL', '1900-01-01', 'III', 8),
('CPL', '1900-01-01', 'IV', 8),
('CPL', '1900-01-01', 'V', 9),
('CPL', '1973-01-01', 'I', 7),
('CPL', '1973-01-01', 'II', 8),
('CPL', '1973-01-01', 'III', 8),
('CPL', '1973-01-01', 'IV', 9),
('CPL', '1997-10-10', 'X', 7),
('CPL', '1997-10-10', 'Y', 8),
('CPL', '1997-10-10', 'Z', 9),
('HFL', '1997-10-10', '', 24),
('HFO', '1997-10-10', '', 23),
('JWO', '1900-01-01', 'I', 14),
('JWO', '1900-01-01', 'II', 15),
('JWO', '1900-01-01', 'III', 15),
('JWO', '1900-01-01', 'IV', 15),
('JWO', '1900-01-01', 'V', 16),
('JWO', '1973-01-01', 'I', 14),
('JWO', '1973-01-01', 'II', 15),
('JWO', '1973-01-01', 'III', 15),
('JWO', '1973-01-01', 'IV', 16),
('JWO', '1997-10-10', 'X', 14),
('JWO', '1997-10-10', 'Y', 15),
('JWO', '1997-10-10', 'Z', 16),
('LAC', '1900-01-01', 'I', 4),
('LAC', '1900-01-01', 'II', 5),
('LAC', '1900-01-01', 'III', 5),
('LAC', '1900-01-01', 'IV', 5),
('LAC', '1900-01-01', 'V', 6),
('LAC', '1973-01-01', 'I', 4),
('LAC', '1973-01-01', 'II', 5),
('LAC', '1973-01-01', 'III', 5),
('LAC', '1973-01-01', 'IV', 6),
('LAC', '1997-10-10', 'X', 4),
('LAC', '1997-10-10', 'Y', 5),
('LAC', '1997-10-10', 'Z', 6),
('MWO', '1900-01-01', 'I', 20),
('MWO', '1900-01-01', 'II', 21),
('MWO', '1900-01-01', 'III', 21),
('MWO', '1900-01-01', 'IV', 21),
('MWO', '1900-01-01', 'V', 22),
('MWO', '1973-01-01', 'I', 20),
('MWO', '1973-01-01', 'II', 21),
('MWO', '1973-01-01', 'III', 21),
('MWO', '1973-01-01', 'IV', 22),
('MWO', '1997-10-10', 'X', 20),
('MWO', '1997-10-10', 'Y', 21),
('MWO', '1997-10-10', 'Z', 22),
('SGT', '1900-01-01', 'I', 11),
('SGT', '1900-01-01', 'II', 12),
('SGT', '1900-01-01', 'III', 12),
('SGT', '1900-01-01', 'IV', 12),
('SGT', '1900-01-01', 'V', 13),
('SGT', '1973-01-01', 'I', 11),
('SGT', '1973-01-01', 'II', 12),
('SGT', '1973-01-01', 'III', 12),
('SGT', '1973-01-01', 'IV', 13),
('SGT', '1997-10-10', 'X', 11),
('SGT', '1997-10-10', 'Y', 12),
('SGT', '1997-10-10', 'Z', 13),
('SGT(DIP)', '1997-10-10', 'X', 10),
('WO', '1900-01-01', 'I', 17),
('WO', '1900-01-01', 'II', 18),
('WO', '1900-01-01', 'III', 18),
('WO', '1900-01-01', 'IV', 18),
('WO', '1900-01-01', 'V', 19),
('WO', '1973-01-01', 'I', 17),
('WO', '1973-01-01', 'II', 18),
('WO', '1973-01-01', 'III', 18),
('WO', '1973-01-01', 'IV', 19),
('WO', '1997-10-10', 'X', 17),
('WO', '1997-10-10', 'Y', 18),
('WO', '1997-10-10', 'Z', 19);

-- --------------------------------------------------------

--
-- Table structure for table `circular_tbl`
--

CREATE TABLE IF NOT EXISTS `circular_tbl` (
  `circular_num` int(11) NOT NULL,
  `PPO_type` varchar(10) NOT NULL,
  `pen_rate_type` char(10) NOT NULL,
  `effdt` date NOT NULL,
  `circ_category` char(6) NOT NULL,
  `service_yrs` float NOT NULL,
  `pension_rate` decimal(10,0) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `circular_tbl`
--

INSERT INTO `circular_tbl` (`circular_num`, `PPO_type`, `pen_rate_type`, `effdt`, `circ_category`, `service_yrs`, `pension_rate`, `remarks`) VALUES
(502, 'normal', 'ORD_FAM', '1900-01-01', '1', 15, '6225', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '1', 15.5, '6225', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '1', 16, '6182', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '1', 16.5, '6292', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '1', 17, '6402', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '2', 15, '5125', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '2', 15.5, '5196', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '2', 16, '5291', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '2', 16.5, '5385', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '2', 17, '5480', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '3', 15, '4940', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '3', 15.5, '4940', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '3', 16, '4940', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '3', 16.5, '5027', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '3', 17, '5116', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '4', 15, '5525', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '4', 15.5, '5525', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '4', 16, '5525', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '4', 16.5, '5525', '12234'),
(502, 'normal', 'ORD_FAM', '1900-01-01', '4', 17, '5525', '12234');

-- --------------------------------------------------------

--
-- Table structure for table `veteran_tbl`
--

CREATE TABLE IF NOT EXISTS `veteran_tbl` (
  `service_num` int(11) NOT NULL,
  `mem_num` int(11) NOT NULL,
  `rank_code` char(10) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address1` varchar(100) NOT NULL,
  `address2` varchar(100) NOT NULL,
  `address3` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(30) NOT NULL,
  `pin_code` int(11) NOT NULL,
  `trade` varchar(20) NOT NULL,
  `join_dt` date NOT NULL,
  `birth_dt` date NOT NULL,
  `discharge_dt` date NOT NULL,
  `death_dt` int(11) NOT NULL,
  `branch_cd` char(10) NOT NULL,
  `force_type` char(3) NOT NULL,
  `ENROLL_DT` date NOT NULL,
  `last_upd_dttm` datetime NOT NULL,
  `last_upd_user` char(20) NOT NULL
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
('AVSM', 'Athi Vishisht Seva Medal', ''),
('PSRI', 'Padma Shri', 'Padma Shri');

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
('wgcdr', 'wing commander', 'aa'),
('WO', 'Warrant Officer', 'undefined');

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
 ADD PRIMARY KEY (`rank_code`,`effdt`,`circ_category`,`vet_group_cd`);

--
-- Indexes for table `circular_tbl`
--
ALTER TABLE `circular_tbl`
 ADD PRIMARY KEY (`PPO_type`,`pen_rate_type`,`effdt`,`circ_category`,`service_yrs`);

--
-- Indexes for table `veteran_tbl`
--
ALTER TABLE `veteran_tbl`
 ADD PRIMARY KEY (`service_num`);

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
