-- College Data Insertion Script for Supabase
-- This script populates the colleges table with data from CSV files

-- Engineering Colleges
INSERT INTO public.colleges (
    name, state, city, location, stream, type, ug_fee, pg_fee, rating, 
    academic_rating, accommodation_rating, faculty_rating, infrastructure_rating, 
    placement_rating, social_life_rating, courses, facilities, established_year, 
    intake, cutoff_requirements, placement_percentage, average_package, highest_package
) VALUES
-- IITs and NITs
('Indian Institute of Technology Madras', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Engineering', 'Government', 250000, 250000, 8.7, 9.0, 7.9, 8.7, 8.8, 8.8, 9.0, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE', 'B.Tech Chemical'], 
 ARRAY['Research Labs', 'Hostel', 'Sports Complex', 'Library', 'Medical Center'], 
 1959, 1000, 'JEE Advanced - 100+', 95, '₹18 LPA', '₹1.5 Cr'),

('Indian Institute of Technology Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Engineering', 'Government', 250000, 250000, 8.9, 9.2, 8.1, 8.9, 9.0, 9.1, 8.8, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE', 'B.Tech Chemical'], 
 ARRAY['Research Labs', 'Hostel', 'Sports Complex', 'Library', 'Medical Center'], 
 1961, 1200, 'JEE Advanced - 150+', 97, '₹20 LPA', '₹2 Cr'),

('Indian Institute of Technology Bombay', 'Maharashtra', 'Mumbai', 'Mumbai, Maharashtra', 'Engineering', 'Government', 250000, 250000, 8.8, 9.1, 8.0, 8.8, 8.9, 8.9, 8.7, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE', 'B.Tech Chemical'], 
 ARRAY['Research Labs', 'Hostel', 'Sports Complex', 'Library', 'Medical Center'], 
 1958, 1100, 'JEE Advanced - 120+', 96, '₹19 LPA', '₹1.8 Cr'),

('NIT Trichy', 'Tamil Nadu', 'Tiruchirappalli', 'Tiruchirappalli, Tamil Nadu', 'Engineering', 'Government', 150000, 150000, 8.5, 8.6, 7.8, 8.2, 8.7, 8.8, 8.7, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE'], 
 ARRAY['Research Labs', 'Hostel', 'Sports Complex', 'Library'], 
 1964, 800, 'JEE Main - 95+', 90, '₹12 LPA', '₹50 LPA'),

('Vellore Institute of Technology', 'Tamil Nadu', 'Vellore', 'Vellore, Tamil Nadu', 'Engineering', 'Private', 350000, 350000, 8.3, 8.3, 8.0, 7.8, 8.9, 8.5, 8.5, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE', 'B.Tech IT'], 
 ARRAY['Modern Campus', 'Hostel', 'Sports Complex', 'Library', 'Placement Cell'], 
 1984, 2000, 'VITEEE - 80+', 85, '₹8 LPA', '₹25 LPA'),

('Delhi Technological University', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Engineering', 'Government', 200000, 200000, 8.4, 8.5, 7.5, 8.3, 8.6, 8.4, 8.2, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE'], 
 ARRAY['Research Labs', 'Hostel', 'Sports Complex', 'Library'], 
 1941, 600, 'JEE Main - 90+', 88, '₹10 LPA', '₹30 LPA'),

-- Arts Colleges
('Loyola College Chennai', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Arts', 'Private', 15000, 20000, 8.6, 8.7, 8.2, 8.3, 8.9, 8.4, 8.8, 
 ARRAY['B.A. English', 'B.A. History', 'B.A. Economics', 'B.A. Psychology'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium', 'Canteen'], 
 1925, 500, 'Class 12 - 85%+', 80, '₹4 LPA', '₹12 LPA'),

('Presidency College Chennai', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Arts', 'Government', 10000, 15000, 8.2, 8.8, 7.3, 8.9, 8.1, 7.6, 8.6, 
 ARRAY['B.A. English', 'B.A. History', 'B.A. Economics', 'B.A. Political Science'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium'], 
 1840, 400, 'Class 12 - 90%+', 75, '₹3 LPA', '₹8 LPA'),

('Madras Christian College', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Arts', 'Private', 20000, 25000, 8.6, 8.5, 7.9, 8.6, 8.7, 8.4, 9.2, 
 ARRAY['B.A. English', 'B.A. History', 'B.A. Economics', 'B.A. Psychology'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium', 'Canteen'], 
 1837, 600, 'Class 12 - 80%+', 82, '₹5 LPA', '₹15 LPA'),

-- Commerce Colleges
('Stella Maris College Chennai', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Commerce', 'Private', 25000, 30000, 8.2, 8.8, 7.5, 8.6, 8.4, 7.6, 8.5, 
 ARRAY['B.Com', 'B.Com Hons', 'BBA', 'B.Com CA'], 
 ARRAY['Library', 'Computer Lab', 'Auditorium', 'Canteen'], 
 1947, 400, 'Class 12 - 85%+', 78, '₹4 LPA', '₹10 LPA'),

('Ethiraj College for Women', 'Tamil Nadu', 'Chennai', 'Chennai, Tamil Nadu', 'Commerce', 'Private', 20000, 25000, 8.1, 8.5, 7.3, 8.2, 7.9, 7.9, 8.6, 
 ARRAY['B.Com', 'B.Com Hons', 'BBA', 'B.Com CA'], 
 ARRAY['Library', 'Computer Lab', 'Auditorium', 'Canteen'], 
 1948, 350, 'Class 12 - 80%+', 75, '₹3.5 LPA', '₹8 LPA'),

-- Medical Colleges
('All India Institute of Medical Sciences Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Medical', 'Government', 50000, 100000, 9.2, 9.5, 8.5, 9.3, 9.0, 9.4, 8.8, 
 ARRAY['MBBS', 'MD', 'MS', 'MCh', 'DM'], 
 ARRAY['Hospital', 'Research Labs', 'Hostel', 'Library', 'Medical Center'], 
 1956, 100, 'NEET - 99%+', 100, '₹15 LPA', '₹50 LPA'),

('Christian Medical College Vellore', 'Tamil Nadu', 'Vellore', 'Vellore, Tamil Nadu', 'Medical', 'Private', 500000, 800000, 8.8, 9.0, 8.2, 8.9, 8.7, 8.9, 8.5, 
 ARRAY['MBBS', 'MD', 'MS', 'MCh', 'DM'], 
 ARRAY['Hospital', 'Research Labs', 'Hostel', 'Library'], 
 1900, 150, 'NEET - 95%+', 95, '₹12 LPA', '₹40 LPA'),

-- Management Colleges
('Indian Institute of Management Ahmedabad', 'Gujarat', 'Ahmedabad', 'Ahmedabad, Gujarat', 'Management', 'Government', 2000000, 2000000, 9.1, 9.3, 8.8, 9.2, 9.0, 9.5, 8.9, 
 ARRAY['MBA', 'PGP', 'FPM', 'PGPX'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium', 'Placement Cell'], 
 1961, 400, 'CAT - 99%+', 100, '₹25 LPA', '₹1 Cr'),

('Indian Institute of Management Bangalore', 'Karnataka', 'Bangalore', 'Bangalore, Karnataka', 'Management', 'Government', 2000000, 2000000, 9.0, 9.2, 8.7, 9.1, 8.9, 9.4, 8.8, 
 ARRAY['MBA', 'PGP', 'FPM', 'PGPX'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium', 'Placement Cell'], 
 1973, 450, 'CAT - 99%+', 100, '₹24 LPA', '₹1.2 Cr'),

-- Law Colleges
('National Law School of India University', 'Karnataka', 'Bangalore', 'Bangalore, Karnataka', 'Law', 'Government', 100000, 150000, 8.9, 9.1, 8.3, 8.9, 8.8, 8.9, 8.7, 
 ARRAY['BA LLB', 'LLM', 'PhD'], 
 ARRAY['Library', 'Moot Court', 'Hostel', 'Sports Complex'], 
 1987, 200, 'CLAT - 95%+', 95, '₹8 LPA', '₹25 LPA'),

('National Law University Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Law', 'Government', 120000, 180000, 8.7, 8.9, 8.1, 8.7, 8.6, 8.7, 8.5, 
 ARRAY['BA LLB', 'LLM', 'PhD'], 
 ARRAY['Library', 'Moot Court', 'Hostel', 'Sports Complex'], 
 2008, 180, 'CLAT - 90%+', 90, '₹7 LPA', '₹20 LPA'),

-- Science Colleges
('Indian Institute of Science Bangalore', 'Karnataka', 'Bangalore', 'Bangalore, Karnataka', 'Science', 'Government', 300000, 500000, 9.0, 9.3, 8.5, 9.1, 8.9, 9.2, 8.7, 
 ARRAY['B.Sc', 'M.Sc', 'PhD', 'Integrated PhD'], 
 ARRAY['Research Labs', 'Library', 'Hostel', 'Sports Complex'], 
 1909, 300, 'JEE Advanced - 98%+', 98, '₹18 LPA', '₹1 Cr'),

('Tata Institute of Fundamental Research', 'Maharashtra', 'Mumbai', 'Mumbai, Maharashtra', 'Science', 'Government', 200000, 300000, 8.8, 9.0, 8.2, 8.9, 8.7, 8.9, 8.4, 
 ARRAY['M.Sc', 'PhD', 'Integrated PhD'], 
 ARRAY['Research Labs', 'Library', 'Hostel'], 
 1945, 100, 'JAM - 95%+', 95, '₹15 LPA', '₹80 LPA');

-- Add more colleges from different states and streams
INSERT INTO public.colleges (
    name, state, city, location, stream, type, ug_fee, pg_fee, rating, 
    academic_rating, accommodation_rating, faculty_rating, infrastructure_rating, 
    placement_rating, social_life_rating, courses, facilities, established_year, 
    intake, cutoff_requirements, placement_percentage, average_package, highest_package
) VALUES
-- More Engineering Colleges
('Birla Institute of Technology and Science Pilani', 'Rajasthan', 'Pilani', 'Pilani, Rajasthan', 'Engineering', 'Private', 400000, 500000, 8.4, 8.6, 8.1, 8.4, 8.7, 8.5, 8.3, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech Chemical'], 
 ARRAY['Modern Campus', 'Hostel', 'Sports Complex', 'Library', 'Placement Cell'], 
 1964, 1500, 'BITSAT - 85%+', 88, '₹9 LPA', '₹35 LPA'),

('Manipal Institute of Technology', 'Karnataka', 'Manipal', 'Manipal, Karnataka', 'Engineering', 'Private', 300000, 400000, 8.1, 8.3, 7.8, 8.1, 8.4, 8.2, 8.0, 
 ARRAY['B.Tech CSE', 'B.Tech EE', 'B.Tech ME', 'B.Tech CE'], 
 ARRAY['Modern Campus', 'Hostel', 'Sports Complex', 'Library'], 
 1957, 1200, 'MET - 80%+', 85, '₹7 LPA', '₹25 LPA'),

-- More Arts Colleges
('St. Stephen\'s College Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Arts', 'Government', 15000, 20000, 8.8, 9.0, 8.5, 8.9, 8.7, 8.6, 9.0, 
 ARRAY['B.A. English', 'B.A. History', 'B.A. Economics', 'B.A. Philosophy'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium'], 
 1881, 300, 'Class 12 - 95%+', 85, '₹5 LPA', '₹15 LPA'),

('Lady Shri Ram College for Women', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Arts', 'Government', 12000, 18000, 8.5, 8.7, 8.0, 8.6, 8.4, 8.3, 8.8, 
 ARRAY['B.A. English', 'B.A. History', 'B.A. Economics', 'B.A. Psychology'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium'], 
 1956, 400, 'Class 12 - 90%+', 80, '₹4 LPA', '₹12 LPA'),

-- More Commerce Colleges
('Shri Ram College of Commerce', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Commerce', 'Government', 15000, 20000, 8.9, 9.1, 8.3, 8.8, 8.6, 8.7, 8.9, 
 ARRAY['B.Com Hons', 'B.A. Economics', 'B.Sc Statistics'], 
 ARRAY['Library', 'Computer Lab', 'Auditorium', 'Canteen'], 
 1926, 500, 'Class 12 - 98%+', 90, '₹8 LPA', '₹25 LPA'),

('Hindu College Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Commerce', 'Government', 12000, 18000, 8.3, 8.5, 7.8, 8.2, 8.1, 8.0, 8.4, 
 ARRAY['B.Com', 'B.Com Hons', 'B.A. Economics'], 
 ARRAY['Library', 'Computer Lab', 'Auditorium'], 
 1899, 450, 'Class 12 - 85%+', 75, '₹4 LPA', '₹10 LPA'),

-- More Medical Colleges
('King George\'s Medical University', 'Uttar Pradesh', 'Lucknow', 'Lucknow, Uttar Pradesh', 'Medical', 'Government', 40000, 80000, 8.5, 8.7, 7.9, 8.4, 8.3, 8.6, 8.2, 
 ARRAY['MBBS', 'MD', 'MS', 'MCh'], 
 ARRAY['Hospital', 'Research Labs', 'Hostel', 'Library'], 
 1911, 200, 'NEET - 90%+', 92, '₹10 LPA', '₹30 LPA'),

('JIPMER Puducherry', 'Puducherry', 'Puducherry', 'Puducherry, Puducherry', 'Medical', 'Government', 30000, 60000, 8.7, 8.9, 8.1, 8.6, 8.5, 8.8, 8.4, 
 ARRAY['MBBS', 'MD', 'MS', 'MCh'], 
 ARRAY['Hospital', 'Research Labs', 'Hostel', 'Library'], 
 1823, 150, 'JIPMER - 95%+', 94, '₹12 LPA', '₹35 LPA'),

-- More Management Colleges
('Xavier Labour Relations Institute', 'Jharkhand', 'Jamshedpur', 'Jamshedpur, Jharkhand', 'Management', 'Private', 1500000, 2000000, 8.8, 9.0, 8.3, 8.9, 8.7, 9.1, 8.6, 
 ARRAY['MBA', 'PGP', 'FPM'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium', 'Placement Cell'], 
 1949, 300, 'XAT - 95%+', 95, '₹18 LPA', '₹60 LPA'),

('Faculty of Management Studies Delhi', 'Delhi', 'New Delhi', 'New Delhi, Delhi', 'Management', 'Government', 1000000, 1500000, 8.6, 8.8, 8.0, 8.7, 8.5, 8.9, 8.3, 
 ARRAY['MBA', 'Executive MBA', 'PhD'], 
 ARRAY['Library', 'Hostel', 'Sports Complex', 'Auditorium'], 
 1954, 250, 'CAT - 98%+', 90, '₹15 LPA', '₹50 LPA'),

-- More Law Colleges
('NALSAR University of Law', 'Telangana', 'Hyderabad', 'Hyderabad, Telangana', 'Law', 'Government', 120000, 180000, 8.6, 8.8, 8.0, 8.7, 8.5, 8.6, 8.4, 
 ARRAY['BA LLB', 'LLM', 'PhD'], 
 ARRAY['Library', 'Moot Court', 'Hostel', 'Sports Complex'], 
 1998, 180, 'CLAT - 90%+', 88, '₹6 LPA', '₹18 LPA'),

('National Law University Jodhpur', 'Rajasthan', 'Jodhpur', 'Jodhpur, Rajasthan', 'Law', 'Government', 100000, 150000, 8.4, 8.6, 7.8, 8.5, 8.3, 8.4, 8.2, 
 ARRAY['BA LLB', 'LLM', 'PhD'], 
 ARRAY['Library', 'Moot Court', 'Hostel', 'Sports Complex'], 
 1999, 200, 'CLAT - 85%+', 85, '₹5 LPA', '₹15 LPA'),

-- More Science Colleges
('Indian Statistical Institute', 'West Bengal', 'Kolkata', 'Kolkata, West Bengal', 'Science', 'Government', 50000, 100000, 8.7, 8.9, 8.2, 8.8, 8.6, 8.8, 8.3, 
 ARRAY['B.Stat', 'M.Stat', 'M.Tech', 'PhD'], 
 ARRAY['Research Labs', 'Library', 'Hostel'], 
 1931, 150, 'ISI - 90%+', 92, '₹12 LPA', '₹40 LPA'),

('Indian Institute of Science Education and Research', 'West Bengal', 'Kolkata', 'Kolkata, West Bengal', 'Science', 'Government', 200000, 300000, 8.5, 8.7, 8.0, 8.6, 8.4, 8.5, 8.2, 
 ARRAY['BS-MS', 'PhD', 'Integrated PhD'], 
 ARRAY['Research Labs', 'Library', 'Hostel', 'Sports Complex'], 
 2006, 200, 'IISER - 95%+', 90, '₹10 LPA', '₹30 LPA');

-- Add coordinates for major cities (you can expand this)
UPDATE public.colleges SET latitude = 28.6139, longitude = 77.2090 WHERE city = 'New Delhi';
UPDATE public.colleges SET latitude = 13.0827, longitude = 80.2707 WHERE city = 'Chennai';
UPDATE public.colleges SET latitude = 19.0760, longitude = 72.8777 WHERE city = 'Mumbai';
UPDATE public.colleges SET latitude = 12.9716, longitude = 77.5946 WHERE city = 'Bangalore';
UPDATE public.colleges SET latitude = 22.5726, longitude = 88.3639 WHERE city = 'Kolkata';
UPDATE public.colleges SET latitude = 17.3850, longitude = 78.4867 WHERE city = 'Hyderabad';
UPDATE public.colleges SET latitude = 26.2389, longitude = 73.0243 WHERE city = 'Jodhpur';
UPDATE public.colleges SET latitude = 26.9124, longitude = 75.7873 WHERE city = 'Jaipur';
UPDATE public.colleges SET latitude = 11.0168, longitude = 76.9558 WHERE city = 'Coimbatore';
UPDATE public.colleges SET latitude = 12.2388, longitude = 79.0746 WHERE city = 'Vellore';
